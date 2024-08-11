import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@src/api/user/dto/create-user.dto';
import {
  EmailAndPasswordDto,
  EmailResetPassword,
  ResetPasswordData,
} from '@src/api/user/dto/reset-password';
import { UpdateUserDto } from '@src/api/user/dto/update-user.dto';
import { User } from '@src/api/user/entities/user.entity';
import { ApiResponses, createApiResponses } from '@src/shared/api-response';
import { EmailService } from '@src/shared/mail/email.service';
import {
  MSG_CONFIRMATION_ACC,
  USER_CACHED_PREFIX,
} from '@src/utils/messages-utils';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import moment from 'moment';
import { Repository } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { ProfileType } from '../profiles/profile-type/profile-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async getAllUsers(): Promise<ApiResponses<User[]>> {
    const count = await this.userRepository.count();

    if (count === 0) {
      throw new NotFoundException('No Users Found !!');
    }

    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'All Users are fetched Successfully !!',
      data: await this.userRepository.find(),
    });
  }

  async create(createUserDto: CreateUserDto) {
    const [_randomCode, foundUser] = [
      UserService.generateRandomCode(),
      await this.findUserByMail(createUserDto.email),
    ];

    if (!foundUser) {
      const { randomCode, expirationDate } = await this.emailService.sendEmail(
        createUserDto.email,
        MSG_CONFIRMATION_ACC,
        _randomCode,
      );

      const user = this.userRepository.create({
        email: createUserDto.email,
        password: await UserService.hashPassword(createUserDto.password),
      }) as User;

      await this.cacheService.set(`${USER_CACHED_PREFIX}${randomCode}`, {
        user,
        randomCode,
        expirationDate,
      });

      delete user.password;

      return createApiResponses({
        statusCode: HttpStatus.OK,
        message: 'User Info received with success',
        data: { ...user, randomCode },
      });
    } else {
      throw new BadRequestException('User already exist !!');
    }
  }

  async confirmAccount(code: string) {
    const key = USER_CACHED_PREFIX + code;
    const userCachedData = await this.cacheService.get<{
      user: User;
      randomCode: number;
      expirationDate: Date;
    }>(key);
    const [expirationDate, currentDate] = [
      moment(userCachedData.expirationDate),
      moment(),
    ];
    const isWithin24Hours = expirationDate.diff(currentDate, 'hours') <= 24;
    if (isWithin24Hours && code === userCachedData.randomCode.toString()) {
      const user: User = userCachedData.user;

      user.profile = Profile.of({
        firstname: 'Votre nom ici',
        lastname: 'Votre prénom ici',
        phoneNumber: 'Votre numéro de téléphone ici',
        type: ProfileType.Talent,
        biography: 'Votre biographie ici',
        platformsUrl: null,
        skills: JSON.parse(''),
      });

      const result = await this.userRepository.save(user);
      
      await this.cacheService.del(key);
      
      return createApiResponses({
        statusCode: HttpStatus.OK,
        message: 'Account confirmed and created successfully !!!',
        data: result,
      });
    }

    if (!userCachedData) {
      throw new NotFoundException('User data cached not found...');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = this.userRepository.create(updateUserDto);
    user.id = id;
    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'User updated with success',
      data: await this.userRepository.save(user),
    });
  }

  async deleteUser(id: string) {
    try {
      const result = await this.userRepository.delete(id);
      return createApiResponses({
        statusCode: HttpStatus.OK,
        message: 'User deleted with success',
        data: result.affected === 1,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public static async validatePassword(
    password: string,
    user: User,
  ): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  public findUserByMail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async generateResetCode(
    emailResetPassword: EmailResetPassword,
  ): Promise<number> {
    const { userEmail } = emailResetPassword; // Get the email from the DTO
    const foundUser = await this.findUserByMail(userEmail);
    if (foundUser) {
      const randomCode = UserService.generateRandomCode();
      await this.emailService.sendEmail(
        userEmail,
        MSG_CONFIRMATION_ACC,
        randomCode,
      );
      await this.cacheService.set(userEmail, randomCode, 300); // Expire after 5 minutes
      return 1; // Return 1 to indicate success
    } else {
      return 0; // Return 0 to indicate failure
    }
  }

  async resetPassword(emailAndPasswordDto: EmailAndPasswordDto): Promise<User> {
    const { userEmail, password: newPassword } = emailAndPasswordDto; // Get the email and new password from the DTO
    const foundUser = await this.findUserByMail(userEmail);
    const cachedCode = await this.cacheService.get(userEmail); // Get the cached code
    if (
      foundUser &&
      (await this.checkResetCode({ email: userEmail, code: +cachedCode }))
    ) {
      foundUser.password = await UserService.hashPassword(newPassword); // Hash the new password
      await this.removeResetCode(userEmail); // Remove the cached code
      return this.userRepository.save(foundUser);
    } else {
      throw new BadRequestException('User not found !!');
    }
  }

  async checkResetCode(
    resetPasswordData: ResetPasswordData,
  ): Promise<ApiResponses> {
    const { email, code } = resetPasswordData; // Get the email and code from the DTO
    const cachedCode = await this.cacheService.get(email); // Get the cached code

    if (cachedCode === code) {
      // Return true if the code is correct
      return createApiResponses({
        statusCode: HttpStatus.OK,
        message: 'Code verified successfully !!',
      });
    }
  }

  async removeResetCode(userEmail: string): Promise<void> {
    await this.cacheService.del(userEmail); // Delete the cached code
  }

  private static generateRandomCode(): number {
    return Math.floor(Math.random() * (99999 - 11111)) + 11111; // Generate a random 5-digit number
  }

  public async updateRefreshToken(id: string, refreshToken: string) {
    const findUser: User = await this.userRepository.findOne({
      where: { id: id },
    });
    findUser.refreshTokenHashed = await bcrypt.hash(refreshToken, 10);
    return await this.userRepository.save(findUser);
  }

  public async getUserById(id: string): Promise<ApiResponses<User>> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: '',
      data: user,
    });
  }

  public async getUserWithProfile(id: string): Promise<User> {
    const user = this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['profile'],
    });

    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }

  public async hardCreate(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponses<User>> {
    let user: User = this.userRepository.create();
    user.email = createUserDto.email;
    user.password = await UserService.hashPassword(createUserDto.password);

    user = await this.userRepository.save(user);

    return createApiResponses({
      statusCode: HttpStatus.OK,
      message: 'User hard created successfully.',
      data: user,
    });
  }

  async generateUsers(count: number) {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      const $user: User = User.of({
        email: faker.internet.email(),
        password: await UserService.hashPassword('Password@4709'),
        created_at: new Date(),
        updated_at: new Date(),
      });
      users.push($user);
    }
    const generatedUsers = await this.userRepository.save(users);

    return generatedUsers
      ? createApiResponses({
          statusCode: HttpStatus.OK,
          message: 'SUCCESSFULLY GENERATED USERS',
          data: `Number of users generated: ${count}`,
        })
      : createApiResponses({
          statusCode: HttpStatus.OK,
          message: 'IMPOSSIBLE TO GENERATE USERS',
        });
  }
}
