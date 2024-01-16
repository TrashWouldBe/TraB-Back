import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn({ type: 'varchar' })
  uid: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  image: string;
}
