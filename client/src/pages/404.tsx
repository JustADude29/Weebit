import Link from "next/link";

export default function notFound(){
    return(
        <div className="flex flex-col items-center">
            <h1 className="mt-20 mb-4 text-5xl text-green-900">
                Page Not Found
            </h1>
            <Link href={'/'} className="px-4 py-2 hollow button">
                Home
            </Link>
        </div>
    )
}
