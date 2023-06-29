import { Request, Response, Router } from "express";

import auth from "../middleware/auth";
import User from "../entity/User";
import { Post } from "../entity/Post";
import Vote from "../entity/Vote";
import Comment from "../entity/Comment";
import { Equal, FindOptions, FindOptionsWhere } from "typeorm";

const vote = async (req: Request, res: Response) => {
    const {identifier, slug, commentIdentifier, value} = req.body

    //validating vote value
    if(![-1,0,1].includes(value)){
        return res.status(400).json({ value: 'Value must be -1 or 0 or 1' })
    }

    try {
        const user: User = res.locals.user
        let post = await Post.findOneOrFail({ where:{ identifier: identifier, slug: slug } })
        let vote: Vote | undefined
        let comment: Comment | undefined

        if(commentIdentifier){
            // if there is comment identifier find vote by comment
            comment = await Comment.findOneByOrFail({ identifier: identifier })
            vote = await Vote.findOneByOrFail({ user: user as FindOptionsWhere<User>, comment: comment as FindOptionsWhere<Comment> })
        } else {
            // find vote with post
            vote = await Vote.findOneByOrFail({ user: user as FindOptionsWhere<User>, post: post as FindOptionsWhere<Post> })
        }

        if(!vote && value === 0){
            // if no vote and value 0 - error
            return res.status(404).json({ error: 'Vote not found' })
        }
        else if(!vote){
            // if no vote, create it
            vote = new Vote({ user, value })
            if(comment)
                vote.comment = comment
            else
                vote.post = post
            await vote.save()
        }
        else if(value === 0){
            // if vote exists and value is 0, remove it
            await vote.remove()
        }
        else if(vote.value !== value){
            // vote is there and needs to be updated to new value
            vote.value = value
            await vote.save()
        }

        post = await Post.findOne({ where:{ identifier: identifier, slug: slug },  relations: ['comments', 'sub', 'votes'] })

        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'sth wrong' })
    }
}

const rounter = Router()
rounter.post('/vote', auth, vote)
export default rounter