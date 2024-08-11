import { Profile } from '@src/api/profiles/entities/profile.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: `users` })
export class User {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Id of the user',
  })
  @Exclude({ toPlainOnly: true })
  id: string;

  @Column({
    type: 'varchar',
    comment: 'Email of the user',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    comment: 'Password of the user',
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @CreateDateColumn({
    type: 'timestamp',
    comment: 'creation date of the user',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: 'Updated date of the User',
  })
  updated_at: Date;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  refreshTokenHashed: string;

  @OneToOne(() => Profile, (profile: Profile) => profile.user)
  profile: Profile;

  public static of(params: Partial<User>):User  {
    const _user = new User();
    Object.assign(_user, params);
    return _user;
  }

}
