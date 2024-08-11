import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from '@src/api/user/user.service';
import { UpdateUserDto } from '@src/api/user/dto/update-user.dto';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { CreateUserDto } from '@src/api/user/dto/create-user.dto';
import { ApiKeyGuard } from '@src/api/common/guards/api-key/api-key.guard';
import { Public } from '@src/api/user/decorator/public.decorator';


@Controller('users')
@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {}

    @ApiBearerAuth()
    @ApiOperation({
        summary:"Get all users",
    })
    @Get()
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }


    @ApiBearerAuth()
    @ApiOperation({
        summary:"Put Information to a specific user ",
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: "Id of the User to update",
        type: String,
    })
    @Put(":id")
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
        return await this.userService.updateUser(id, user);
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:"Delete a specific user"
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: "Id of the User to delete",
        type: String,
    })
    @Delete(":id")
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);  
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:"Retrieve a specific User"
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: "Id of the User to retrieve",
        type: String,
    })
    @Get(':id')
    async findUserById(@Param('id') id: string) {
        return await this.userService.getUserById(id);
    }

    @Public()
    @UseGuards(ApiKeyGuard)
    @ApiOperation({
        summary: 'Hard create user'
    })
    @ApiHeader({
        name: 'x-api-key',
        description: 'Super Admin api key',
    })
    @Post('hard-create')
    async hardCreate(@Body() createUserDto: CreateUserDto) {
        return this.userService.hardCreate(createUserDto);
    }

}