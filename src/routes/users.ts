import { Request, Response, Router } from "express";

import user from "../middleware/user";
import User from "../entity/User";
import { Post } from "../entity/Post";
import Comment from "../entity/Comment";


const getUserPosts =async (req:Request, res: Response) => {
    try {
        const user = await User.findOneOrFail({ 
            where: { username: req.params.username },
            select: ['username', 'joinedAt']
        })

        const posts = await Post.find({
            where: { username: user.username },
            relations: ['comments', 'sub']
        })

        const comments = await Comment.find({
            where: { username: user.username },
            relations: ['post']
        })

        let submissions: any[] = []
        posts.forEach(p => submissions.push({ type: 'Post', ...p.toJSON() }))
        comments.forEach(c => submissions.push({ type: 'Comment', ...c.toJSON() }))

        submissions.sort((a,b) => {
            if(b.joinedAt > a.joinedAt) return 1
            if(b.joinedAt < a.joinedAt) return -1
            return 0
        })

        return res.json({ user, submissions })
    } catch (error) {
        console.log(error)
        return res.json({ error: "sth wrong" })
    }
}

const router = Router()
router.get('/:username', user, getUserPosts)
export default router