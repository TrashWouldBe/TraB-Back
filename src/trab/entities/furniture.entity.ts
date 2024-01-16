import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trab } from './trab.entity';

@Entity('furniture')
export class Furniture {
  @PrimaryGeneratedColumn()
  key: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'boolean', default: false })
  is_arrange: boolean;

  @Column({ type: 'boolean', default: false })
  is_get: boolean;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Trab, (trab) => trab.trab_id)
  @JoinColumn({ name: 'trab_id' })
  trab: Trab;
}
