import { Request, Response, Router } from "express";

import { Post } from "../entity/Post";
import AppDataSource from "../data-source";
import Sub from "../entity/Sub";

const topSubs = async (req:Request, res: Response) => {
    try {
        const subs = await AppDataSource
            .createQueryBuilder()
            .select(`s.title, s.name, count(p.id) as "postCount"`)
            .from(Sub, 's')
            .leftJoin(Post, 'p', `s.name = p."subName"`)
            .groupBy('s.title, s.name')
            .orderBy('"postCount"', 'DESC')
            .limit(5)
            .execute()
        
        return res.json(subs)
    } catch (err) {
        return res.status(500).json({ error: "sth wrong" })
    }
}

const rounter = Router()
rounter.get('/top-subs', topSubs)
export default rounter