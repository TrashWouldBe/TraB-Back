import { Column,Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('plogging')

export class Plogging{
    @PrimaryGeneratedColumn()
    plogging_id : number;

    @Column({ type: 'date',nullable : false})
    run_date : Date;

    @Column({type : 'varchar', nullable : false})
    run_name : string;

    @Column({ type : 'float', nullable : false})
    run_range : number;

    @Column({ type : 'time', nullable : false})
    run_time : Date;

    @Column({type : 'varchar', nullable : false})
    id : string;

}