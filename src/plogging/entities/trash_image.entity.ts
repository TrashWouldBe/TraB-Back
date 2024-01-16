import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Plogging } from './plogging.entity';

@Entity('trash_image')
export class Trash_image {
  @PrimaryGeneratedColumn()
  key: number;

  @Column({ type: 'varchar', nullable: false })
  trash_tag: string;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Plogging, (plogging) => plogging.plogging_id)
  @JoinColumn({ name: 'plogging_id' })
  plogging: Plogging;
}
