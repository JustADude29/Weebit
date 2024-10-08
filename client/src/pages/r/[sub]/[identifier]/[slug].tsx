import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR, { mutate } from 'swr'
import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import classNames from 'classnames'

import icon_small from "../../../../../public/icons/icon_small.png"
import Sidebar from "@/components/Sidebar";
import { Post, Comment } from "@/types";
import { useAuthState } from "@/context/auth";

dayjs.extend(relativeTime);

export default function PostPage() {
  const [newComment, setNewComment] = useState('')
  const [description, setDescription] = useState('')
  const { authenticated, user } = useAuthState()

  const router = useRouter()
  const { identifier, sub, slug } = router.query

  const { data: post, error } = useSWR<Post>((identifier && slug) ? `/posts/${identifier}/${slug}` : null)
  const { data: comments, revalidate } = useSWR<Comment[]>((identifier && slug) ? `/posts/${identifier}/${slug}/comments` : null)

  if (error) router.push('/')

  useEffect(() => {
    if (!post) return
    let desc = post.body || post.title
    desc = desc.substring(0, 158).concat('..') // Hello world..
    setDescription(desc)
  }, [post])

  const vote = async (value: number, comment?: Comment) => {
    if (!authenticated) router.push('/login')

    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    ) value = 0

    try {
      await axios.post('/misc/vote', {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      })

      revalidate()
    } catch (err) {
      console.log(err)
    }
  }

  const submitComment = async (event: FormEvent) => {
    event.preventDefault()
    if (newComment.trim() === '') return

    try {
      await axios.post(`/posts/${identifier}/${slug}/comment`, { body: newComment })

      setNewComment('')
      mutate(`/posts/${identifier}/${slug}/comments`)
    } catch (erer) {
      console.log(erer)
    }
  }

  return (
    <>
      <Head>
        <title>
          {post?.title}
        </title>
      </Head>
      <div className="pt-12">
        <Link href={`/r/${sub}`}>
          <div className="flex items-center w-full h-20 p-8 bg-green-700">
            <div className="container flex">
              {post && (
                <div className="mr-2">
                  <Image
                    src={icon_small}
                    alt="icon"
                    className="rounded-full"
                    width={70}
                    height={70}
                  />
                </div>
              )}
              <p className="pt-8 pl-2 text-xl font-semibold text-green-300">
                r/{sub}
              </p>
            </div>
          </div>
        </Link>
        <div className="container flex pt-5">
          {/* post */}
          <div className="w-160">
            <div className="rounded bg-green-100">
              {post && (
                <>
                  <div className="flex">
                    {/* Vote section */}
                    <div className="flex-shrink-0 w-10 py-3 text-center bg-green-200 rounded-l">
                      {/*upvote*/}
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-green-300 hover:text-red-500"
                        onClick={() => vote(1)}
                      >
                        <i
                          className={classNames('fas fa-arrow-up', {
                            'text-red-500': post.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className="text-xs font-bold text-green-600">{post.voteScore}</p>
                      {/*downvote*/}
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-green-300 hover:text-blue-600"
                        onClick={() => vote(-1)}
                      >
                        <i
                          className={classNames('fas fa-arrow-down', {
                            'text-blue-600': post.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="flex items-center">
                      <p className="text-xs text-green-600">
                        Posted by
                        <Link legacyBehavior href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">/u/{post.username}</a>
                        </Link>
                        <Link legacyBehavior href={post.url}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.joinedAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    <h1 className="my-1 text-xl font-medium text-green-600">{post.title}</h1>
                    <p className="my-3 text-sm text-green-700">{post.body}</p>
                    <div className="flex">
                      <Link legacyBehavior href={post.url}>
                        <a>
                          <div className="px-1 py-1 mr-1 text-sm rounded text-green-600 hover:bg-green-300">
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">{post.commentCount} Comments</span>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>
                  {/* comment input */}
                  <div className="pl-10 pr-6 mb-4">
                    {authenticated ? (
                      <div>
                        <p className="mb-1 text-xs text-green-600">
                          Comment as
                          <Link href={`/u/${user?.username}`} className="px-2 font-semibold text-green-500">
                            {user?.username}
                          </Link>
                        </p>
                        <form onSubmit={submitComment}>
                          <textarea
                            className="w-full p-3 border rounded bg-green-300 border-green-300 hover:border-green-400 focus:border-green-400 focus:outline-none text-green-600"
                            onChange={e => setNewComment(e.target.value)}
                            value={newComment}
                          />
                          <div className="flex justify-end">
                            <button className="px-3 py-1 light button" disabled={newComment.trim() === ''}>
                              Comment
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="flex items-center px-2 py-4 border rounded border-green-700 justify-evenly">
                        <p className="text-green-700">Login or Sign Up to leave a comment</p>
                        <div>
                          <Link href={'/login'} className="px-5 py-2 hollow button">
                            Login
                          </Link>
                        </div>
                        <div>
                          <Link href={'/register'} className="px-5 py-2 light button">
                            SignUp
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="h-px border-0 dark:bg-green-100 rounded" />
                  {/* comment feed */}
                  {comments?.map((comment) => {
                    return (<div className="flex py-2 pl-2" key={comment.identifier}>
                      {/* Vote section */}
                      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                        {/* Upvote */}
                        <div
                          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-green-300 hover:text-red-500"
                          onClick={() => vote(1, comment)}
                        >
                          <i
                            className={classNames('fas fa-arrow-up', {
                              'text-red-500': comment.userVote === 1,
                            })}
                          ></i>
                        </div>
                        <p className="text-xs font-bold">{comment.voteScore}</p>
                        {/* Downvote */}
                        <div
                          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-green-300 hover:text-blue-600"
                          onClick={() => vote(-1, comment)}
                        >
                          <i
                            className={classNames('fas fa-arrow-down', {
                              'text-blue-600': comment.userVote === -1,
                            })}
                          ></i>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="mb-1 text-xs leading-none text-green-600">
                          <Link href={`/u/${comment.username}`} className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </Link>
                          <span className="mr-1 text-green-600">-</span>
                          <span className="text-green-600">
                            {dayjs(comment.joinedAt).fromNow()}
                          </span>
                        </p>
                        <p className="text-green-700">{comment.body}</p>
                      </div>
                    </div>)
                  })}
                </>
              )}
            </div>
          </div>
          {/* sidebar */}
          {post?.sub && <Sidebar sub={post.sub}></Sidebar>}
        </div>
      </div>
    </>
  )
}
