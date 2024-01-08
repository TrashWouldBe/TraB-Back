import {Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Plogging } from "./plogging.entity";

@Entity('trash_image')
export class Trash_image {
    @PrimaryGeneratedColumn()
    key : number;

    @Column({type : 'varchar', nullable : false})
    trash_tag : string;

    @ManyToOne(() => Plogging, (plogging) => plogging.id)
    id : number;
}