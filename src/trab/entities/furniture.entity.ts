import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trab } from "./trab.entity";


@Entity('furniture')
export class Furniture{
    @PrimaryGeneratedColumn()
    key : number;

    @ManyToOne(() => Trab, (trab) => trab.trab_id)
    key2 : number;
}