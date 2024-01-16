import { Trab } from 'src/trab/entities/trab.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('snack')
export class Snack {
  @PrimaryGeneratedColumn()
  Key: number;

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
  Styrofoam: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  general_waste: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  food_waste: number;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => Trab, (trab) => trab.trab_id)
  @JoinColumn({ name: 'trab_id' })
  trab: Trab;
}
