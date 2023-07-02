import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from "next/link";
import React from "react";

import { Post } from "@/types";
import { useRouter } from 'next/router';

dayjs.extend(relativeTime)

interface PostCardProps {
    post: Post
}

export default function PostCard({ post }: PostCardProps) {

    const router = useRouter()

    const isInSubPage = router.pathname === '/r/[sub]'

    return (
        <div key={post.identifier} className="flex mb-4 rounded bg-fuchsia-950" id={post.identifier}>
            {/* post stuff */}
            <div className="w-full p-2">
                <div className="flex items-center">
                    {!isInSubPage &&
                        <>
                            <Link href={`/r/${post.subName}`}>
                                <img src="https://aniyuki.com/wp-content/uploads/2022/03/aniyuki-anime-girl-avatar-51.jpg" className="w-6 h-6 mr-1 rounded-full"></img>
                            </Link>
                            <Link legacyBehavior href={`/r/${post.subName}`}>
                                <a className="text-xs font-bold text-fuchsia-500 hover:underline">
                                    /r/{post.subName}
                                </a>
                            </Link>
                        </>
                    }
                    <p className="text-xs text-fuchsia-600">
                        {!isInSubPage && <span className="mx-1">-</span>}
                        Posted by
                        <Link className="mx-1 font-medium hover:underline" href={`/u/${post.username}`}>
                            /u/{post.username}
                        </Link>
                        <Link className="mx-1 hover:underline" href={post.url}>
                            {dayjs(post.joinedAt).fromNow()}
                        </Link>
                    </p>
                </div>
                <Link className="my-1 text-lg font-medium text-fuchsia-300" href={post.url}>
                    {post.title}
                </Link>
                {post.body && <p className="my-1 text-sm text-fuchsia-200">{post.body}</p>}

                <div className="flex">
                    <Link href={post.url}>
                        <div className="px-1 py-1 mr-1 text-sm rounded text-fuchsia-600 hover:bg-fuchsia-900">
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">{post.commentCount} Comments</span>
                        </div>
                    </Link>
                    {/* <div className="px-1 py-1 mr-1 text-sm rounded cursor-pointer text-fuchsia-600 hover:bg-fuchsia-900">
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                    </div>
                    <div className="px-1 py-1 mr-1 text-sm rounded cursor-pointer text-fuchsia-600 hover:bg-fuchsia-900">
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                    </div> */}
                </div>
            </div>
        </div>
    )
}