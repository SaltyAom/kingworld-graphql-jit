import { graphql, buildSchema, parse } from 'graphql'

import { compileQuery, isCompiledQuery } from '../src/graphql-jit'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { createHmac } from 'crypto'

import { v5 as uuidv5 } from 'uuid'


const schema = `
type User {
    id: Int!
    username: String!
    password: String!
}

type Query {
    hello: String!
    user: User!
    users: [User!]!
}`

const query = `{
    user {
        id
        username
    }
}`

const Query = {
    hello: () => "Hi",
    user: () => ({
        id: 1,
        username: 'saltyaom',
        password: '12345678'
    }),
    users: () => ([{
        id: 1,
        username: 'saltyaom',
        password: '12345678'
    }, {
        id: 2,
        username: 'aomkirby123',
        password: '12345678'
    }
])
}

let t = performance.now()
let ops = 50_000
// for (let i = 0; i < ops; i++) {
//     Bun.peek(graphql({
//         schema: buildSchema(schema),
//         rootValue: {
//             hello: () => 'hi'
//         },
//         source: query,
//         variableValues: {}
//     }))
// }

// console.log(
//     `gql ${Intl.NumberFormat().format(
//         +((ops / (performance.now() - t)) * 1000).toFixed(0)
//     )} ops/s`
// )

// // https://stackoverflow.com/a/52171480
const tsh = (s: string) => {
    for (var h = 9, i = 0; i < s.length; i++) {
        const ch = s.charCodeAt(i)
        if (ch === 32 || ch === 9 || ch === 10) continue
        h = Math.imul(h ^ ch, 9 ** 9)
    }

    return h ^ (h >>> 9)
}

const jit = compileQuery(
    makeExecutableSchema({
        typeDefs: schema,
        resolvers: {
            Query
        }
    }),
    parse(query)
)

const cache = new Map()

// @ts-ignore
cache.set(tsh(query), jit.query)

// const cache = {
//     // @ts-ignore
//     [tsh(query)]: jit.query
// }

if (isCompiledQuery(jit)) {
    let t = performance.now()
    ops = 25_000_000
    for (let i = 0; i < ops; i++) {
        cache.get(tsh(query))({}, {}, {})
    }

    console.log(
        `jit simulated query ${Intl.NumberFormat().format(
            +((ops / (performance.now() - t)) * 1000).toFixed(0)
        )} ops/s`
    )

    t = performance.now()
    ops = 25_000_000
    for (let i = 0; i < ops; i++) jit.query({}, {}, {})

    console.log(
        `jit raw ${Intl.NumberFormat().format(
            +((ops / (performance.now() - t)) * 1000).toFixed(0)
        )} ops/s`
    )
}

// let t = performance.now()
// let ops = 25_000_000
// for (let i = 0; i < ops; i++) hashFnv32a(query)

// console.log(
//     `fnv32a ${Intl.NumberFormat().format(
//         +((ops / (performance.now() - t)) * 1000).toFixed(0)
//     )} ops/s`
// )

// t = performance.now()
// ops = 25_000_000
// for (let i = 0; i < ops; i++) tsh(query)

// console.log(
//     `tsh ${Intl.NumberFormat().format(
//         +((ops / (performance.now() - t)) * 1000).toFixed(0)
//     )} ops/s`
// )
