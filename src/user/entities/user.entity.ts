import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn({ type: 'varchar' })
  uid: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  image: string;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
