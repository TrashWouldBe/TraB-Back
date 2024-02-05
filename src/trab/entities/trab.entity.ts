import { User } from 'src/user/entities/user.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trab')
export class Trab {
  @PrimaryGeneratedColumn()
  trab_id: number;

  @Column({ type: 'varchar', nullable: false })
  trab_name: string;

  @Column({ type: 'int', nullable: false })
  snack_cnt: number;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToOne(() => User, (user) => user.uid, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'uid' })
  user: User;
}
