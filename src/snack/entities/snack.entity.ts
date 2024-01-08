import { Trab } from "src/trab/entities/trab.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('snack')
export class Snack {
    @PrimaryGeneratedColumn()
    Key: number;

    @Column({type : 'int', nullable : false, default : 0})
    glass : number;

    @Column({type : 'int', nullable : false, default : 0})
    paper : number;

    @Column({type : 'int', nullable : false, default : 0})
    can : number;
    
    @Column({type : 'int', nullable : false, default : 0})
    plastic : number;

    @Column({type : 'int', nullable : false, default : 0})
    vinyl : number;

    @Column({type : 'int', nullable : false, default : 0})
    Styrofoam : number;
    
    @Column({type : 'int', nullable : false, default : 0})
    general_waste : number;

    @Column({type : 'int', nullable : false, default : 0})
    food_waste : number;

    @OneToOne(() => Trab, (trab)=>trab.trab_id)
    trab_id : number;
}