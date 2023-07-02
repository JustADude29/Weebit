import dayjs from "dayjs";

import { Sub } from "@/types";
import { useAuthState } from "@/context/auth";
import Link from "next/link";


export default function Sidebar({ sub }: { sub: Sub }) {
    const { authenticated } = useAuthState()
    return(
        <div className="hidden ml-6 w-80 md:block">
            <div className="rounded bg-fuchsia-950">
                <div className="p-3 rounded-t bg-fuchsia-900">
                    <p className="font-semibold text-fuchsia-300">About Community</p>
                </div>
                <div className="p-3">
                    <p className="mb-3 text-md">{sub.description}</p>
                    <div className="flex mb-3 text-sm font-medium">
                        <div className="w-1/2">
                            <p>6.9k</p>
                            <p>members</p>
                        </div>
                        <div className="w-1/2">
                            <p>69</p>
                            <p>online</p>
                        </div>
                    </div>
                    <p className="my-3 text-xs">
                        <i className="mr-2 fas fa-birthday-cake"></i>
                        Created On: {dayjs(sub.joinedAt).format('D/MM/YYYY')}
                    </p>
                    {authenticated && (
                        <Link legacyBehavior href={`/r/${sub.name}/submit`}>
                            <a className="w-full py-2 light button">
                                Create Post
                            </a>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}