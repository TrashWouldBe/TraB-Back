import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, DeleteDateColumn } from 'typeorm';
import { Snack } from 'src/snack/entities/snack.entity';

@Entity('trash_image')
export class Trash_image {
  @PrimaryGeneratedColumn()
  image_id: number;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'varchar', nullable: false })
  trash_tag: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_used: boolean;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Snack, (snack) => snack.snack_id, {
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'snack_id' })
  snack: Snack;
}
