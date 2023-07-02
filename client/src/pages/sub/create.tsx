import axios from "axios"
import { IncomingMessage, ServerResponse } from "http"
import { GetServerSideProps, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { FormEvent, useState } from "react"
import classNames from "classnames"
import { useRouter } from "next/router"

export default function CreateSub() {
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [errors, setErrors] = useState<Partial<any>>({})

    const router = useRouter()

    const createSub = async (event: FormEvent) => {
        event.preventDefault()
        
        try {
            const res = await axios.post(`/sub`, { name, title, description })
            
            if(res)
                router.push(`/r/${res.data.name}`)
        } catch (err: any) {
            console.log(err)
            setErrors(err.response.data)
        }
    }

    return (
        <div className="flex">
            <Head>
                <title>Create a SubWebit</title>
            </Head>
            <div className="h-screen bg-center bg-cover w-36" style={{ backgroundImage: "url('/images/background.jpg')" }}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-98">
                    <h1 className="mb-2 text-lg font-medium text-fuchsia-200">
                        Create a Community
                    </h1>
                    <hr className="h-px border-0 dark:bg-fuchsia-700" />
                    <form onSubmit={createSub}>
                        <div className="my-6">
                            <p className="font-medium text-fuchsia-300">
                                Name
                            </p>
                            <p className="text-xs text-fuchsia-600">Community name cannot be changed later, also make it funny</p>
                            <input
                                type="text"
                                className={classNames(
                                    "w-full p-3 border rounded border-fuchsia-800 bg-fuchsia-900 focus:outline-none hover:border-fuchsia-600 focus:border-fuchsia-600 text-fuchsia-300",
                                    { 'border-red-600': errors.name })}
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <small className="font-medium text-red-600">{errors.name}</small>
                        </div>
                        <div className="my-6">
                            <p className="font-medium text-fuchsia-300">
                                Title
                            </p>
                            <p className="text-xs text-fuchsia-600">Idk man, title and all you can change any time </p>
                            <input
                                type="text"
                                className={classNames("w-full p-3 border rounded border-fuchsia-800 bg-fuchsia-900 focus:outline-none hover:border-fuchsia-600 focus:border-fuchsia-600 text-fuchsia-300",
                                    { 'border-red-600': errors.title })}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            <small className="font-medium text-red-600">{errors.title}</small>
                        </div>
                        <div className="my-6">
                            <p className="font-medium text-fuchsia-300">
                                Description
                            </p>
                            <p className="text-xs text-fuchsia-600">Describe your community ig? idk</p>
                            <textarea
                                className="w-full p-3 border rounded border-fuchsia-800 bg-fuchsia-900 focus:outline-none hover:border-fuchsia-600 focus:border-fuchsia-600 text-fuchsia-300"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button className="px-4 py-1 text-sm font-medium capitalize rounded-full light button">
                                Create Community
                            </button>
                        </div>
                    </form>
                </div>
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