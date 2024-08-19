export interface Post {
    identifier: string
    title: string
    body?: string
    slug: string
    subName: string
    username: string
    joinedAt: string
    updatedAt: string
    sub?: Sub

    url: string
    voteScore?: number
    commentCount?: number
    userVote?: number
}

export interface User {
    username: string
    email: string
    joinedAt: string
    updatedAt: string
}

export interface Sub{
    joinedAt: string
    updatedAt: string
    name: string
    title: string
    description: string
    username: string
    posts: Post[]
    postCount?: number
}

export interface Comment{
    joinedAt: string
    upadtedAt: string
    identifier: string
    body: string
    username: string
    post?: Post

    userVote: number
    voteScore: number
}
