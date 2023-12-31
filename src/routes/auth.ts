import { Request, Response, Router } from "express";
import { validate, isEmpty } from 'class-validator'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";


import User from "../entity/User";
import auth from "../middleware/auth";

const mapErrors = (errors: Object[]) => {
    return errors.reduce((prev: any, err: any) => {
        prev[err.property] = Object.entries(err.constraints)[0][1]
        return prev
    }, {})
}

const register = async (req: Request, res: Response)  => {
    const { email, username, password } = req.body

  try {
    // Validate data
    let errors: any = {}
    const emailUser = await User.findOne({ where: { email:email }})
    const usernameUser = await User.findOne({ where: { username:username }})

    if (emailUser) errors.email = 'Email is already taken'
    if (usernameUser) errors.username = 'Username is already taken'

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors)
    }

    // Create the user
    const user = new User({ email, username, password })

    errors = await validate(user)
    if (errors.length > 0) {
      return res.status(400).json(mapErrors(errors))
    }

    await user.save()

    // Return the user
    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    try {
        let errors: any = {}

        if(isEmpty(username)) errors.username = 'Username field is empty'
        if(isEmpty(password)) errors.password = 'Password field is empty'

        if(Object.keys(errors).length > 0) {
            return res.status(401).json(errors)
        }

        const user = await User.findOne({ where: {username: username} })

        if(!user){ 
            errors.username = 'User not found'
            return res.status(404).json(errors)
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch) {
            errors.password = "Incorrect Password"
            return res.status(401).json({ password: "incorrect password" })
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET)

        res.set(
            'Set-Cookie', 
            cookie.serialize('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600,
            path: '/',
        }))

        return res.json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const me = (_: Request, res: Response) => {
    return res.json(res.locals.user)
}

const logout = (_: Request, res: Response) => {
    res.set(
        'Set-Cookie',
        cookie.serialize('token', '', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/',
        }))

    return res.status(200).json({ success: true })
}

const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/logout', auth, logout)
router.get('/me', auth, me)
export default router
