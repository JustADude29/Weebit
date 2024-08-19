import { Request, Response, Router } from "express";
import Comment from "../entity/Comment";
import Post from "../entity/Post";
import Sub from "../entity/Sub";
import User from "../entity/User";
import Vote from "../entity/Vote";
import auth from "../middleware/auth";
import user from "../middleware/user";

import AppDataSource from "../data-source";

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body

  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({ value: 'Value must be -1, 0 or 1' })
  }
  try {
    const user: User = res.locals.user
    let post = await Post.findOneOrFail({ where: {identifier, slug} })
    let vote: Vote | undefined
    let comment: Comment | undefined

    if (commentIdentifier) {
      // IF there is a comment identifier find vote by comment
      comment = await Comment.findOneOrFail({ where: {identifier: commentIdentifier} })
      vote = await Vote.findOne({ 
        where: {
          user: {
            id: user.id
          }, 
          comment: {
            id: comment.id
          } 
        }
      })
    } else {
      vote = await Vote.findOne({ 
        where: {
          user: {
            id: user.id
          }, 
          post: {
            id: post.id
          } 
        }
      })
    }

    if (!vote && value === 0) {
      return res.status(404).json({ error: 'Vote not found' })
    } else if (!vote) {
      vote = new Vote({ user, value })
      if (comment) vote.comment = comment
      else vote.post = post
      await vote.save()
    } else if (value === 0) {
      await vote.remove()
    } else if (vote.value !== value) {
      vote.value = value
      await vote.save()
    }

    post = await Post.findOneOrFail({ where:{ identifier: identifier, slug: slug },relations: ['comments', 'comments.votes', 'sub', 'votes'] })
    post.setUserVote(user)
    post.comments.forEach((c) => c.setUserVote(user))

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

const topSubs = async (_:Request, res: Response) => {
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

const router = Router()
router.post('/vote', user, auth, vote)
router.get('/top-subs', topSubs)
export default router
