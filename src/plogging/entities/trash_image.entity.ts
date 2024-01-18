import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, DeleteDateColumn } from 'typeorm';
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

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Snack, (snack) => snack.snack_id)
  @JoinColumn({ name: 'snack_id' })
  snack_id: Trab;
}
