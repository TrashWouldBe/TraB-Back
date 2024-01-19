import { User } from 'src/user/entities/user.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plogging')
export class Plogging {
  @PrimaryGeneratedColumn()
  plogging_id: number;

  @Column({ type: 'date', nullable: false })
  run_date: Date;

  @Column({ type: 'varchar', nullable: false })
  run_name: string;

  @Column({ type: 'float', nullable: false })
  run_range: number;

  @Column({ type: 'time', nullable: false })
  run_time: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  trab_snack: number;

  @Column({ type: 'int', nullable: false })
  calorie: number;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.uid, {
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'uid' })
  user: User;
}
