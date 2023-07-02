import PostCard from "@/components/PostCard";
import { Comment, Post } from "@/types";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from 'swr'

export default function user() {
    const router = useRouter()
    const username = router.query.username

    const { data, error } = useSWR<any>(username ? `/user/${username}` : null)
    if (error) router.push('/')


    return (
        <div className="pt-12">
            <Head>
                <title>{data?.user.username}</title>
            </Head>
            {data && (
                <div className="container flex pt-5">
                    <div className="w-160">
                        {data.submissions.map((submission: any) => {
                            if (submission.type === 'Post') {
                                const post: Post = submission
                                return <PostCard key={post.identifier} post={post} />
                            } else {
                                const comment: Comment = submission
                                return (
                                    <div key={comment.identifier} className="flex my-4 rounded bg-fuchsia-950">
                                        <div className="flex-shrink-0 w-10 py-4 text-center rounded-1 bg-fuchsia-950">
                                            <i className="fas fa-comment-alt fa-xs text-fuchsia-500"></i>
                                        </div>
                                        <div className="w-full p-2">
                                            <p className="mb-2 text-xs text-fuchsia-500">
                                            {comment.username}
                                                <Link href={`/u/${comment.username}`} className="hover:underline text-fuchsia-400">
                                                    <span></span>
                                                </Link>
                                                <span> commented on </span>
                                                <Link href={`${comment.post.url}`} className="font-semibold hover:underline text-fuchsia-400">{comment.post.title}</Link>
                                                <span className="mx-1">-</span>
                                                <Link href={`/r/${comment.post.subName}`} className="font-semibold hover:underline text-fuchsia-400">/r/{comment.post.subName}</Link>
                                            </p>
                                            <hr className="h-px border-0 dark:bg-fuchsia-700" />
                                            <p className="text-fuchsia-300">{comment.body}</p>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div className="ml-6 w-80">
                        <div className="p-3 rounded bg-fuchsia-900">
                            <div className="rounded-t bg-fuchsia-900">
                                <img 
                                    src="https://aniyuki.com/wp-content/uploads/2022/03/aniyuki-anime-girl-avatar-51.jpg" 
                                    alt="userprofile" 
                                    className="w-16 h-16 mx-auto rounded-full"
                                />
                            </div>
                            <div className="p-3 text-center">
                                <h1 className="mb-3 text-xl text-fuchsia-300">{data.user.username}</h1>
                                <hr className="h-px border-0 dark:bg-fuchsia-700" />
                                <p className="mt-2 text-fuchsia-400">Joined: {dayjs(data.user.joinedAt).format('MM YYYY')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}