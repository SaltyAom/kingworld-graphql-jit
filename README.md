# @kingworldjs/graphql-jit
An **experimental** plugin for [kingworld](https://github.com/saltyaom/kingworld) that adds support for using GraphQL JIT.

## Installation
```bash
bun add graphql @kingworldjs/graphql-jit
```

## Example
```typescript
import { KingWorld } from 'kingworld'
import { graphql } from '../src'

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
    .listen(8080)
```

### path
@default "/graphql"

Path to expose as GraphQL handler

### schema

GraphQL schema
### resolvers
Resolvers funcitons
```typescript
resolvers: {
    Query?: Record<string, Function | Promise<Function>>
    Mutation?: Record<string, Function | Promise<Function>>
    Subscription?: Record<string, Function | Promise<Function>>
}
```