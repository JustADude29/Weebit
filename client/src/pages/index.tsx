import Head from "next/head";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";

import icon_small from "../../public/icons/icon_small.png";
import { Post, Sub } from "@/types";
import PostCard from "@/components/PostCard";
import { useAuthState } from "@/context/auth";

export default function Home() {
  const [observedPost, setObservedPost] = useState("");

  const { authenticated } = useAuthState();

  const description =
    "Weebit is a Online Space for anyone to discuss about anything";
  const title = "Weebit: for weebs ig? idk";

  // const { data: posts } = useSWR<Post[]>('/posts')
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`);

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;

    if (id !== observedPost) {
      setObservedPost(id);
      if (document.getElementById(id) != null)
        observerPost(document.getElementById(id));
    }
  }, [posts]);

  const observerPost = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          // console.log('bottom came')
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 },
    );
    observer.observe(element);
  };

  return (
    <div className="pt-12">
      <div>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="ig:title" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Head>
        <div className="container flex pt-4">
          {/* posts */}
          {isInitialLoading && (
            <div className="text-lg text-center text-green-500">Loading...</div>
          )}
          <div className="w-full sm:px-4 md:p-0 md:w-160">
            {posts?.map((post) => (
              <PostCard
                post={post}
                key={post.identifier}
                revalidate={revalidate}
              ></PostCard>
            ))}
          </div>
          {isValidating && posts.length > 0 && (
            <div className="text-lg text-center text-green-500">
              Loading more posts...
            </div>
          )}
          {/* sidebar */}
          <div className="hidden ml-6 w-80 md:block">
            <div className="pb-2 rounded bg-green-200">
              <div className="p-4 border-b-2 border-green-600">
                <p className="text-lg font-semibold text-center bg-transparent text-green-600">
                  Top Communities
                </p>
              </div>
              <div>
                {topSubs?.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-center px-4 py-2 text-xs border-b border-green-500"
                  >
                    <div className="mr-2 overflow-hidden rounded-full">
                      <Link href={`/r/${sub.name}`}>
                        <Image
                          src={icon_small}
                          alt="icon"
                          width={(6 * 16) / 4}
                          height={(6 * 16) / 4}
                        />
                      </Link>
                    </div>
                    <Link legacyBehavior href={`/r/${sub.name}`}>
                      <a className="font-bold text-green-600">/r/{sub.name}</a>
                    </Link>
                    {sub.postCount == 1 ? (
                      <p className="ml-auto font-med text-green-500">
                        {sub.postCount} post
                      </p>
                    ) : (
                      <p className="ml-auto font-med text-green-500">
                        {sub.postCount} posts
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {authenticated && (
                <div className="p-4">
                  <Link
                    href={`/sub/create`}
                    className="w-full px-2 py-1 light button"
                  >
                    Create SubWebit
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
