import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('trab')
export class Trab {
  @PrimaryGeneratedColumn()
  trab_id: number;

  @Column({ type: 'varchar', nullable: false })
  trab_name: string;

  @Column({ type: 'int', nullable: false })
  snack_cnt: number;

  @OneToOne(() => User, (user) => user.uid)
  @JoinColumn({ name: 'uid' })
  uid: User;
}
