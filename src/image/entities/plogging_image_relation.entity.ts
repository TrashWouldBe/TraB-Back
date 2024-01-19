import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trash_image } from './trash_image.entity';
import { Plogging } from 'src/plogging/entities/plogging.entity';

@Entity('plogging_image_relation')
export class Plogging_image_relation {
  @PrimaryGeneratedColumn()
  relation_id: number;

  @ManyToOne(() => Plogging, (plogging) => plogging.plogging_id, {
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'plogging_id' })
  plogging: Plogging;

  @OneToOne(() => Trash_image, (trash_image) => trash_image.image_id, {
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'image_id' })
  trash_image: Trash_image;
}
