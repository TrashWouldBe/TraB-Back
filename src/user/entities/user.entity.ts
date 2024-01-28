import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn({ type: 'varchar' })
  uid: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'int', nullable: true })
  weight: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
