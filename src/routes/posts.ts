import { Request, Response, response } from "express";
import { Router } from "express";

import auth from "../middleware/auth";
import Post from "../entity/Post";
import Sub from "../entity/Sub";
import Comment from "../entity/Comment";
import user from "../middleware/user";

const createPost = async (req: Request, res: Response) => {
    const { title, body, sub } = req.body

    const user = res.locals.user

    if(title.trim() === '') return res.status(400).json({ title: "title can't be empty" })

    try {
        // subs
        const subCheck = await Sub.findOneOrFail({ where: { name: sub } })

        const post = new Post({ title, body, user, sub: subCheck })
        await post.save()

        return res.json(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error:"sth wrong" })
    }
}

const getPosts = async (req: Request, res: Response) => {
    const currentPage: number = (req.query.page || 0) as number
    const postsPerPage: number = (req.query.count || 10) as number
    try {
        const posts = await Post.find({
            order: { joinedAt: 'DESC' },
            relations: ['comments', 'votes', 'sub'],
            skip: currentPage * postsPerPage,
            take: postsPerPage
        })

        if (res.locals.user) {
          posts.forEach((p) => p.setUserVote(res.locals.user))
        }

        return res.json(posts)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "sth wrong" })
    }
}


const getPost = async (req: Request, res: Response) => {
    const { identifier, slug } = req.params
    try {
        const post = await Post.findOneOrFail({
            where: { identifier: identifier, slug: slug },
            relations: ['comments', 'votes', 'sub']
        })

        if (res.locals.user) {
          post.setUserVote(res.locals.user)
        }

       return res.json(post)
    } catch (error) {
        console.log(error)
        return res.status(404).json({ error: "post not found" })
    }
}


const commentOnPost = async (req: Request, res: Response) => {
    const { identifier, slug } =  req.params
    const { body } = req.body

    try {
        const post = await Post.findOneOrFail({ where:{ identifier: identifier, slug: slug } })

        const comment = new Comment({ 
            body: body,
            user: res.locals.user,
            post: post
        })
        
        await comment.save()
        return res.json(comment)
    } catch (err) {
        console.log(err)
        return res.status(404).json({ error:"post not found" })
    }
}

const getPostComments =async (req:Request, res: Response) => {
    const { identifier, slug } = req.params
    try {
        const post = await Post.findOneOrFail({ 
          where: {identifier: identifier, slug: slug}, 
        })

        const comments = post.comments 

        console.log(comments);

        if(res.locals.user) {
          comments.forEach((c) => c.setUserVote(res.locals.user))
        }

        return res.json(comments)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "sth wrong" })
    }
}

const router = Router()
router.post('/', auth, createPost)
router.get('/', auth, getPosts)
router.get('/:identifier/:slug', auth, getPost)
router.post('/:identifier/:slug/comment', auth, commentOnPost)
router.get('/:identifier/:slug/comments', auth, getPostComments)
export default router
