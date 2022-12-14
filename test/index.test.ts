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
    .use(graphql, {
        path: '/v2/graphql',
        playground: true,
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
    it('handle GraphQL playground ', async () => {
        const res = await app.handle(new Request('/graphql'))

        expect(res.headers.get('Content-Type')).toBe('text/html')
    })

    it('handle custom path ', async () => {
        const res = await app.handle(new Request('/v2/graphql'))

        expect(res.headers.get('Content-Type')).toBe('text/html')
    })

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
