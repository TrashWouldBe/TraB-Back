import { User } from 'src/user/entities/user.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plogging')
export class Plogging {
  @PrimaryGeneratedColumn()
  plogging_id: number;

  @Column({ type: 'varchar', nullable: false })
  run_date: string;

  @Column({ type: 'varchar', nullable: false })
  run_name: string;

  @Column({ type: 'float', nullable: false })
  run_range: number;

  @Column({ type: 'varchar', nullable: false })
  run_time: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  trab_snack: number;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.uid, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uid' })
  user: User;
}
