import { Entity as TOEntity, Column, Index, ManyToOne, JoinColumn, OneToMany } from "typeorm"

import Entity from "./Entity";
import User from "./User";
import { makeId, slugger } from "../../utils/helper";
import { Post } from "./Post";

@TOEntity("subs")
export default class Sub extends Entity {
    constructor(sub?: Partial<Sub>){
        super()
        if(sub) {
            Object.assign(this, sub);
        }
    }

    @Index()
    @Column({ unique: true })
    name: string

    @Column()
    title: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column()
    username: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @OneToMany(() => Post, post => post.sub)
    posts: Post[]
}
