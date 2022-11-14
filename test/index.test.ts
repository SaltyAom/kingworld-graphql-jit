import KingWorld from 'kingworld'

import { describe, expect, it } from 'bun:test'

import graphql from '../src'

const app = new KingWorld()
    .get('/', () => 'Hi')
    .post('/mirror', (context) => context.body)
    .use(graphql, {
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

describe('GraphQL Yoga', () => {
    // it('handle GraphQL playground ', async () => {
    //     const res = await app.handle(req('/graphql?query=%7B%0A++hi%0A%7D'))
    //     const text = await res.text()

    //     expect(text).toBe(JSON.stringify({ data: { hi: 'Hi from KingWorld' } }))
    //     expect(res.headers.get('Content-Type')).toBe(
    //         'application/graphql-response+json; charset=utf-8'
    //     )
    // })

    it('handle GraphQL query', async () => {
        const body = JSON.stringify({ query: '{\n  hello\n}' })

        const res = await app.handle(
            new Request('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length.toString()
                },
                body
            })
        )
        const text = await res.text()
        expect(text).toBe(JSON.stringify({ data: { hello: 'Hello world!' } }))
        expect(res.headers.get('Content-Type')).toBe('application/json')
    })
})
