import useSWR from "swr"
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

import Sidebar from "@/components/Sidebar";
import { Post, Sub } from "@/types";
import Head from "next/head";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { IncomingMessage, ServerResponse } from "http";

export default function submit(){
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const router = useRouter()
    const { sub: subName } = router.query

    const submitPost = async (event: FormEvent) => {
        event.preventDefault()

        if(title.trim() === '') return

        try {
            const { data: post } = await axios.post<Post>('/posts', {title: title.trim(), body: body, sub: subName})

            router.push(`/r/${subName}/${post.identifier}/${post.slug}`)
        } catch (err) {
            console.log(err)
        }
    }

    const { data: sub, error } = useSWR<Sub>(subName ? `/sub/${subName}` : null)
    if(error) router.push('/')
    return (
        <div className="pt-12">
        <div className="container flex pt-5 text-green-700">
            <Head>
                <title>Submit to r/{subName}</title>
            </Head>
            <div className="w-160">
                <div className="p-4 rounded bg-green-200">
                    <h1 className="mb-3 text-xl">
                        Submit to r/{subName}
                    </h1>
                    <form onSubmit={submitPost}>
                        <div className="relative mb-2">
                            <input type="text" className="w-full px-3 py-2 border rounded bg-green-300 border-green-300 focus:outline-none focus:border-green-400 placeholder-green-600" placeholder="Title"  maxLength={300} value={title} onChange={e => setTitle(e.target.value)}/>
                            <div className="absolute mb-2 text-sm select-none text-green-600" style={{top:11, right: 5}}>
                                { title.trim().length }/300
                            </div>
                        </div>
                        <textarea 
                            className="w-full p-3 border rounded bg-green-300 border-green-300 focus:outline-none focus:border-green-400 placeholder-green-600" 
                            value={body}
                            onChange={e=>setBody(e.target.value)}
                            placeholder="Text (optional)" 
                            rows={4}
                        />
                        <div className="flex justify-end">
                            <button className="px-3 py-1 light button" type="submit" disabled={title.trim() === ''}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            { sub && <Sidebar sub={sub}/> }
        </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }: { req: IncomingMessage, res: ServerResponse }): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> => {
    try {
      const cookie = req.headers.cookie;
      if (!cookie) throw new Error('Missing auth token cookie');
  
      await axios.get('/auth/me', { headers: { cookie } });
  
      return { props: {} };
    } catch (err) {
      res.writeHead(307, { Location: '/login' }).end();
      return { props: {} };
    }
}
