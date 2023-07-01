import { Request, Response, Router } from "express"
import { isEmpty } from "class-validator"
import { DataSource } from "typeorm"
import AppDataSource from "../data-source"

import User from "../entity/User"
import Sub from "../entity/Sub"
import auth from "../middleware/auth"
import user from "../middleware/user"
import { Post } from "../entity/Post"

const createSub = async (req: Request, res: Response) => {
    const { name, title, description } = req.body

    const user: User = res.locals.user

    try {
        let errors:any = {}
        if(isEmpty(name)) errors.name = 'Name field must not be empty'
        if(isEmpty(title)) errors.name = 'Title field must not be empty'

        const sub = await AppDataSource.getRepository(Sub)
            .createQueryBuilder('sub')
            .where('lower(sub.name) = :name', { name: name.toLowerCase() })
            .getOne()

        if(sub) errors.name = 'Sub already exists'

        if(Object.keys(errors).length > 0) throw errors

    } catch (err) {
        return res.status(400).json(err)
    }
    

    try {
        const sub = new Sub({ name, title, description, user })
        await sub.save()

        return res.json(sub)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error:"sth wrong" })
    }
}

const getSub =async (req:Request, res: Response) => {
    const name = req.params.name

    try {
        const sub = await Sub.findOneOrFail({ where: { name: name } })
        const posts = await Post.find({
            where: {subName: name},
            order: { joinedAt: 'DESC' },
            relations: ['comments']
        })
        sub.posts = posts

        return res.json(sub)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ sub: "sub not found" })
    }
}

const router = Router();
router.post('/', user, auth, createSub)
router.get('/:name', user, getSub)
export default router