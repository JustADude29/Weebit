import { IsEmail, Length } from "class-validator"
import { Entity as TOEntity, Column, Index, BeforeInsert, OneToMany } from "typeorm"
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

import Entity from "./Entity";
import { Post } from "./Post";
import Vote from "./Vote";

@TOEntity("users")
export default class User extends Entity {
    constructor(user?: Partial<User>){
        super()
        if(user) {
            Object.assign(this, user);
        }
    }

    @Index()
    @IsEmail(undefined, { message: 'Must be a valid Email address' })
    @Length(1, undefined, {message: "Email must not be empty"})
    @Column({ unique: true })
    email: string

    @Index()
    @Length(3, undefined, {message: "Must be atleast 3 characters"})
    @Column({ unique: true })
    username: string

    @Exclude()
    @Column()
    @Length(6, undefined, {message: "Must be atleast 6 characters"})
    password: string

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[]

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 6)
    }
}
