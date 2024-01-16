import { User } from 'src/user/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('trab')
export class Trab {
  @PrimaryGeneratedColumn()
  trab_id: number;

  @Column({ type: 'varchar', nullable: false })
  trab_name: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  snack_cnt: number;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.uid)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
