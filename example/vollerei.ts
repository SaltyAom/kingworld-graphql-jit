import { KingWorld } from 'kingworld'
import { graphql } from '../src'

const app = new KingWorld()
    .get('/', () => 'Hi')
    .post('/mirror', (context) => context.body)
    .use(graphql, {
        path: '/v2/graphql',
        resolvers: {
            Query: {
                by: (id: number) => 'Hello world!'
            }
        },
        schema: `
        type Hifumin {
            id: Int!
            title: HifuminTitle!
            images: HifuminImage!
            info: HifuminInfo!
            metadata: HifuminMetadata!
            comments(
                from: Int
                to: Int
                batch: Int
                batchBy: Int
                orderBy: HifuminCommentOrder
            ): HifuminCommentResponse!
            related: [HifuminResponse!]!
        }
        
        enum HifuminCommentOrder {
            NEWEST
            OLDEST
        }
        
        type HifuminTitle {
            display: String
            english: String
            japanese: String
        }
        
        type HifuminImage {
            cover: HifuminPage!
            thumbnail: HifuminPage!
            pages: [HifuminPage!]!
        }
        
        type HifuminPage {
            link: String!
            info: HifuminPageInfo!
        }
        
        type HifuminPageInfo {
            type: String!
            width: Int!
            height: Int!
        }
        
        type HifuminInfo {
            amount: Int!
            favorite: Int!
            upload: Int!
            mediaId: Int!
        }
        
        type HifuminMetadata {
            parodies: [HifuminTag!]!
            characters: [HifuminTag!]!
            groups: [HifuminTag!]!
            categories: [HifuminTag!]!
            artists: [HifuminTag!]!
            tags: [HifuminTag!]!
            language: String!
        }
        
        type HifuminTag {
            name: String!
            count: Int!
        }
        
        type HifuminCommentResponse {
            total: Int!
            data: [HifuminComment!]!
        }
        
        type HifuminComment {
            id: Int!
            user: HifuminUser!
            created: Int!
            comment: String!
        }
        
        type HifuminUser {
            id: Int!
            username: String!
            slug: String!
            avatar: String!
        }
        
        type HifuminResponse {
            success: Boolean!
            error: String
            data: Hifumin
        }
        
        type MultipleHifuminResponse {
            success: Boolean!
            error: String
            data: [Hifumin!]!
        }
        
        type Query {
            by(id: Int!): HifuminResponse!
        }        
`
    })
    .listen(8080)

// const postReq = new Request('/graphql', {
//     method: 'POST',
//     headers: {
//         'content-type': 'application/json'
//     },
//     body: JSON.stringify({
//         query: `query {
//             hello
//         }`,
//         variables: {}
//     })
// })

// const gqlReq = new Request('/graphql', {
//     method: 'POST',
//     headers: {
//         'content-type': 'application/json',
//         'content-length': '1'
//     },
//     body: JSON.stringify({
//         username: 'saltyaom'
//     })
// })

// let t = performance.now()
// let ops = 2_000_000
// let pendings: Promise<any>[] = []

// for (let i = 0; i < ops; i++) pendings.push(app.handle(postReq.clone()))
// await Promise.all(pendings)

// console.log(
//     `post ${Intl.NumberFormat().format(
//         +((ops / (performance.now() - t)) * 1000).toFixed(0)
//     )} ops/s`
// )

// t = performance.now()
// ops = 2_000_000
// pendings = []

// for (let i = 0; i < ops; i++) pendings.push(app.handle(gqlReq.clone()))
// await Promise.all(pendings)

// console.log(
//     `gql ${Intl.NumberFormat().format(
//         +((ops / (performance.now() - t)) * 1000).toFixed(0)
//     )} ops/s`
// )
