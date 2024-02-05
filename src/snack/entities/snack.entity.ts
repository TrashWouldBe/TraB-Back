import { Trab } from 'src/trab/entities/trab.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

type TrashType = 'glass' | 'paper' | 'can' | 'plastic' | 'vinyl' | 'styrofoam' | 'general' | 'food';

@Entity('snack')
export class Snack {
  @PrimaryGeneratedColumn()
  snack_id: number;

  [key: string]: number | null | Date | Trab | undefined;

  @Column({ type: 'int', nullable: false, default: 0 })
  glass: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  paper: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  can: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  plastic: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  vinyl: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  styrofoam: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  general: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  food: number;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => Trab, (trab) => trab.trab_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trab_id' })
  trab: Trab;
}
