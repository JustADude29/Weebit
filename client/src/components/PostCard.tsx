import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from "next/link";
import React from "react";

import { Post } from "@/types";

dayjs.extend(relativeTime)

interface PostCardProps {
    post: Post
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <div key={post.identifier} className="flex mb-4 rounded bg-fuchsia-950">
            {/* post stuff */}
            <div className="w-full p-2">
                <div className="flex items-center">
                    <Link href={'/r/${post.subName}'}>
                        <img src="https://aniyuki.com/wp-content/uploads/2022/03/aniyuki-anime-girl-avatar-51.jpg" className="w-6 h-6 mr-1 rounded-full"></img>
                    </Link>
                    <Link legacyBehavior href={`/r/${post.subName}`}>
                        <a className="text-xs font-bold text-fuchsia-500 hover:underline">
                            /r/{post.subName}
                        </a>
                    </Link>
                    <p className="text-xs text-fuchsia-600">
                        <span className="mx-1">-</span>
                        Posted by
                        <Link legacyBehavior href={'/u/${post.username}'}>
                            <a className="mx-1 hover:underline">/u/{post.username}</a>
                        </Link>
                        <Link legacyBehavior href={post.url}>
                            <a className="mx-1 hover:underline">
                                {dayjs(post.joinedAt).fromNow()}
                            </a>
                        </Link>
                    </p>
                </div>
                <Link legacyBehavior href={post.url}>
                    <a className="my-1 text-lg font-medium text-fuchsia-300">{post.title}</a>
                </Link>
                {post.body && <p className="my-1 text-sm text-fuchsia-200">{post.body}</p>}

                <div className="flex">
                    <Link legacyBehavior href={post.url}>
                        <a>
                            <div className="px-1 py-1 mr-1 text-sm rounded text-fuchsia-600 hover:bg-fuchsia-900">
                                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                                <span className="font-bold">{post.commentCount} Comments</span>
                            </div>
                        </a>
                    </Link>
                    <div className="px-1 py-1 mr-1 text-sm rounded cursor-pointer text-fuchsia-600 hover:bg-fuchsia-900">
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                    </div>
                    <div className="px-1 py-1 mr-1 text-sm rounded cursor-pointer text-fuchsia-600 hover:bg-fuchsia-900">
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                    </div>
                </div>
            </div>
        </div>
    )
}