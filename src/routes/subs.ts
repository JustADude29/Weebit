import { Request, Response, Router } from "express"
import { isEmpty } from "class-validator"
import { DataSource } from "typeorm"
import AppDataSource from "../data-source"

import User from "../entity/User"
import Sub from "../entity/Sub"
import auth from "../middleware/auth"

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

const router = Router();
router.post('/', auth, createSub)
export default router