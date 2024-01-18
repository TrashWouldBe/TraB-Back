import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inquire } from './inquire.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  image_url: string;
}
