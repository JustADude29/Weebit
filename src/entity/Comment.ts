import { BeforeInsert, Column, EqualOperator, FindOperator, FindOptionsWhere, Index, JoinColumn, ManyToOne, OneToMany, Entity as TOEntity } from "typeorm";

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
    user: User | boolean | FindOperator<any> | FindOptionsWhere<User> | FindOptionsWhere<User>[] | EqualOperator<User>

    @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
    post: Post | boolean | FindOperator<any> | FindOptionsWhere<Post> | FindOptionsWhere<Post>[] | EqualOperator<Post>

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(8)
    }
}