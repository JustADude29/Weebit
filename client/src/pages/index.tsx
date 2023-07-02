import Head from 'next/head'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'

import { Post, Sub } from '@/types'
import PostCard from '@/components/PostCard'
import { useAuthState } from '@/context/auth'

export default function Home() {
    const { authenticated } = useAuthState()
    const { data: posts } = useSWR<Post[]>('/posts')
    const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs')

    return (
        <div className="pt-12">
            <div>
                <Head>
                    <title>Weebit: for weebs ig? idk</title>
                </Head>
                <div className="container flex pt-4">
                    {/* posts */}
                    <div className="w-160">
                        {posts?.map((post) => (
                            <PostCard post={post} key={post.identifier}></PostCard>
                        ))}
                    </div>
                    {/* sidebar */}
                    <div className="ml-auto w-80">
                        <div className='rounded bg-fuchsia-950'>
                            <div className="p-4 border-b-2 border-fuchsia-900">
                                <p className="text-lg font-semibold text-center bg-transparent text-fuchsia-300">
                                    Top Communities
                                </p>
                            </div>
                            <div>
                                {topSubs?.map((sub) => (
                                    <div
                                        key={sub.name}
                                        className="flex items-center px-4 py-2 text-xs border-b border-fuchsia-900">
                                        <div className="mr-2 overflow-hidden rounded-full">
                                            <Link href={`/r/${sub.name}`}>
                                                <Image
                                                    src="/icons/icon_small.png"
                                                    alt="/icons/icon_big.png"
                                                    width={6 * 16 / 4}
                                                    height={6 * 16 / 4}
                                                />
                                            </Link>
                                        </div>
                                        <Link legacyBehavior href={`/r/${sub.name}`}>
                                            <a className="font-bold text-fuchsia-300">
                                                /r/{sub.name}
                                            </a>
                                        </Link>
                                        {sub.postCount == 1 ? (
                                            <p className="ml-auto font-med text-fuchsia-500">{sub.postCount} post</p>
                                        ) : (
                                            <p className="ml-auto font-med text-fuchsia-500">{sub.postCount} posts</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {authenticated && 
                                <div className="p-4">
                                    <Link href={`/sub/create`} className='w-full px-2 py-1 light button'>
                                        Create SubWebit
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}