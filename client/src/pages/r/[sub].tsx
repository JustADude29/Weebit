import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR from 'swr'
import Image from "next/image";

import icon_small from "../../../public/icons/icon_small.png"
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { Post, Sub } from "@/types";

export default function SubPage() {
    const router = useRouter()

    const subName = router.query.sub

    const { data: sub, error } = useSWR<Sub>(subName ? `/sub/${subName}` : null)

    if (error)
        router.push('/')

    let postsMarkUp
    if (!sub) {
        postsMarkUp = <p className="text-lg text-center text-green-600">Loading posts...</p>
    } else if (sub.posts.length === 0) {
        postsMarkUp = <div className="text-lg text-center text-green-600">No Posts yet</div>
    } else {
        postsMarkUp = sub && (
            <div className="w-full sm:px-4 md:p-0 md:w-160">
                {sub.posts.map((post: Post) => <PostCard post={post} key={post.identifier}></PostCard>)}
            </div>
        )
    }

    return (
        <div>
            <Head>
                <title>{sub?.title}</title>
            </Head>
            {sub && (
                <div className="pt-12">
                    <Fragment>
                        <div className="bg-green-900">
                            <div className="h-20 bg-green-700" style={{
                                backgroundImage: `none`
                            }}>
                            </div>
                        </div>
                        <div className="h-30 bg-green-800">
                            <div className="container relative flex">
                                <div className="absolute" style={{ top: -15 }}>
                                    <Image
                                        src={icon_small}
                                        alt="icon"
                                        className="rounded-full"
                                        width={70}
                                        height={70}
                                    />
                                </div>
                                <div className="pt-2 pl-24">
                                    <div className="flex items-center">
                                        <h1 className="mb-1 text-3xl font-bold text-green-200">
                                            {sub.title}
                                        </h1>
                                    </div>
                                    <p className="mb-2 text-sm font-bold text-green-300">
                                        r/{sub.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* posts and sidebar */}
                        <div className="container flex pt-5">
                            <div className="w-160">
                                {postsMarkUp}
                            </div>
                            <Sidebar sub={sub}></Sidebar>
                        </div>
                    </Fragment>
                </div>
            )}
        </div>
    )
}
