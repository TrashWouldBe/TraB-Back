import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trab } from '../../trab/entities/trab.entity';

@Entity('furniture')
export class Furniture {
  @PrimaryGeneratedColumn()
  furniture_id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_arrange: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_get: boolean;

  @ManyToOne(() => Trab, (trab) => trab.trab_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trab_id' })
  trab: Trab;
}
