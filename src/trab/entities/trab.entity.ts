import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('trab')
export class Trab {
    @PrimaryGeneratedColumn()
    trab_id : number;

    @Column({type : 'varchar', nullable : false})
    trab_name : string;

    @Column({type : 'int', nullable : false, default : 0})
    snack_cnt : number;
}