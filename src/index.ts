import { KingWorld } from 'kingworld'
import { graphql as gql, parse, buildSchema } from 'graphql'

import {
    compileQuery,
    isCompiledQuery,
    type CompiledQuery
} from './graphql-jit'
import {
    makeExecutableSchema,
    type IExecutableSchemaDefinition
} from '@graphql-tools/schema'
import { GRAPHIQL } from './constants'
import KingWorldError from 'kingworld/src/error'

// https://stackoverflow.com/a/52171480
const tsh = (s: string) => {
    for (var h = 9, i = 0; i < s.length; i++) {
        const ch = s.charCodeAt(i)
        if (ch === 32 || ch === 9 || ch === 10) continue
        h = Math.imul(h ^ ch, 9 ** 9)
    }

    return h ^ (h >>> 9)
}

export const graphql = (
    app: KingWorld,
    {
        path = '/graphql',
        schema,
        resolvers,
        playground = true
    }: {
        /**
         * @default /graphql
         *
         * path for GraphQL handler
         */
        path?: string
        /**
         * GraphQL Schema
         */
        schema: string
        /**
         * Resolvers funciton
         */
        resolvers: {
            Query?: Record<string, Function | Promise<Function>>
            Mutation?: Record<string, Function | Promise<Function>>
            Subscription?: Record<string, Function | Promise<Function>>
        }
        /**
         * Playground
         */
        playground?: boolean
    } = {
        path: '/graphql',
        schema: '',
        resolvers: {},
        playground: true
    }
) => {
    const gqlSchema = makeExecutableSchema({
        typeDefs: schema,
        resolvers
    })

    const cache: Map<number, CompiledQuery<any>['query']> = new Map()

    return app
        .get(path, () => {
            if (!playground) throw new KingWorldError('NOT_FOUND')

            return new Response(GRAPHIQL, {
                headers: {
                    'content-type': 'text/html'
                }
            })
        })
        .post(path, ((context) => {
            if (!context.body?.query) return

            const hash = tsh(context.body.query)
            if (cache.get(hash))
                return cache.get(hash)!({}, {}, context.body.variables)

            const compiled = compileQuery(
                gqlSchema,
                parse(context.body.query),
                context.body.operationName
            )
            if (isCompiledQuery(compiled)) {
                cache.set(hash, compiled.query)

                return compiled.query({}, {}, context.body.variables)
            }

            return compiled
        }) as (context: any) => any)
}

export default graphql
