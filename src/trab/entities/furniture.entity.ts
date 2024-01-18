import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trab } from './trab.entity';

@Entity('furniture')
export class Furniture {
  @PrimaryGeneratedColumn()
  furniture_id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_arrange: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_get: boolean;

  @ManyToOne(() => Trab, (trab) => trab.trab_id)
  @JoinColumn({ name: 'trab_id' })
  trab: Trab;
}
