import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuthState } from '@/context/auth';
import Axios from 'axios';
import classNames from 'classnames';

import { Post } from "@/types";
import { useRouter } from 'next/router';

dayjs.extend(relativeTime)

interface PostCardProps {
  post: Post
  revalidate?: Function
}

export default function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    joinedAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
  revalidate,
}: PostCardProps) {
  const { authenticated } = useAuthState()

  const router = useRouter()

  const isInSubPage = router.pathname === '/r/[sub]'

  const [localVoteScore, setLocalVoteScore] = useState(voteScore)
  const [localUserVote, setLocalUserVote] = useState(userVote)

  useEffect(() => {
    setLocalVoteScore(voteScore)
    setLocalUserVote(userVote)
  }, [userVote, voteScore])

  const vote = async (value: number) => {
    if (!authenticated) router.push('/login')

    if (value === localUserVote) value = 0

    try {
      const prevVoteScore = localVoteScore
      const prevUserVote = localUserVote

      setLocalUserVote(value)
      setLocalVoteScore(localVoteScore + (value - prevUserVote))

      await Axios.post('/misc/vote', {
        identifier,
        slug,
        value,
      })

      if (revalidate) revalidate()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div key={identifier} className="flex mb-4 rounded bg-green-100" id={identifier}>
      {/* Votes stuff */}
      <div className="w-10 py-3 text-center bg-green-200 rounded-l">
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-green-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i className={classNames('fas fa-arrow-up', { 'text-red-500': localUserVote === 1 })}></i>
        </div>
        <p className="text-xs font-bold text-green-600">{localVoteScore}</p>
        {/* Downvote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-green-300 hover:text-blue-600"
          onClick={() => vote(-1)}
        >

          <i className={classNames('fas fa-arrow-down', { 'text-blue-600': localUserVote === -1 })}></i>

        </div>
      </div>
      {/* stuff */}
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage &&
            <>
              <Link href={`/r/${subName}`}>
                <img src="https://aniyuki.com/wp-content/uploads/2022/03/aniyuki-anime-girl-avatar-51.jpg" className="w-6 h-6 mr-1 rounded-full"></img>
              </Link>
              <Link legacyBehavior href={`/r/${subName}`}>
                <a className="text-xs font-bold text-green-600 hover:underline">
                  /r/{subName}
                </a>
              </Link>
            </>
          }
          <p className="text-xs text-green-600">
            {!isInSubPage && <span className="mx-1">-</span>}
            d by
            <Link className="mx-1 font-medium hover:underline" href={`/u/${username}`}>
              /u/{username}
            </Link>
            <Link className="mx-1 hover:underline" href={url}>
              {dayjs(joinedAt).fromNow()}
            </Link>
          </p>
        </div>
        <Link className="my-1 text-lg font-medium text-green-600" href={url}>
          {title}
        </Link>
        {body && <p className="my-1 text-sm text-green-700">{body}</p>}

        <div className="flex">
          <Link href={url}>
            <div className="px-1 py-1 mr-1 text-sm rounded text-green-600 hover:bg-green-300">
              <i className="mr-1 fas fa-comment-alt fa-xs"></i>
              <span className="font-bold">{commentCount} Comments</span>
            </div>
          </Link>
          {/* <div className="px-1 py-1 mr-1 text-sm rounded cursor-pointer text-green-600 hover:bg-green-900">
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                    </div>
                    <div className="px-1 py-1 mr-1 text-sm rounded cursor-pointer text-green-600 hover:bg-green-900">
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                    </div> */}
        </div>
      </div>
    </div>
  )
}
