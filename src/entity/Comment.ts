import { BeforeInsert, Column, Index, JoinColumn, ManyToOne, OneToMany, Entity as TOEntity } from "typeorm";

import Entity from "./Entity";
import User from "./User";
import { Post } from "./Post";
import { makeId } from "../../utils/helper";
import Vote from "./Vote";
import { Exclude } from "class-transformer";

@TOEntity('comments')
export default class Comment extends Entity {
    constructor(comment?: Partial<Comment>){
        super()
        Object.assign(this, comment)
    }

    @Index()
    @Column()
    identifier: string

    @Column()
    body: string

    @Column()
    username: string

    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
    post: Post

    @Exclude()
    @OneToMany(() => Vote, vote => vote.comment)
    votes: Vote[]

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(8)
    }
}