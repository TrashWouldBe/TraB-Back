import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_image')
export class User_image {
  @PrimaryGeneratedColumn()
  Key: number;

  @ManyToOne(() => User, (user) => user.uid)
  id: string;
}
