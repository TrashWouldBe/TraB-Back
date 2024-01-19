import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('inquire')
export class Inquire {
  @PrimaryGeneratedColumn()
  inq_id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @ManyToOne(() => User, (user) => user.uid, {
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'uid' })
  user: User;
}
