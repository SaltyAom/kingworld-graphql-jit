import { KingWorld } from 'kingworld'
import { graphql } from '../src'

const app = new KingWorld()
    .get('/', () => 'Hi')
    .post('/mirror', (context) => context.body)
    .use(graphql, {
        path: '/v2/graphql',
        resolvers: {
            Query: {
                hello: () => 'Hello world!'
            }
        },
        schema: `
            type Query {
                hello: String
            }`
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
