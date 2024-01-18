import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Plogging } from './plogging.entity';
import { Snack } from 'src/snack/entities/snack.entity';
import { Trab } from 'src/trab/entities/trab.entity';

@Entity('trash_image')
export class Trash_image {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column({ type: 'varchar', nullable: false })
  trash_tag: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @ManyToOne(() => Snack, (snack) => snack.trab_id)
  @JoinColumn({ name: 'trab_id' })
  trab_id: Trab;
}
