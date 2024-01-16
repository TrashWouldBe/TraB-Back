import { Trab } from 'src/trab/entities/trab.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Trab, (trab) => trab.trab_id)
  @JoinColumn({ name: 'trab_id' })
  trab: Trab;
}
