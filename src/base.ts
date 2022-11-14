// import { KingWorld, getPath, t } from 'kingworld'
// import { graphql as gql, buildSchema, parse } from 'graphql'

// export const graphql = (
//     app: KingWorld,
//     {
//         /**
//          * @default /graphql
//          *
//          * path for GraphQL handler
//          */
//         path = '/graphql',
//         schema,
//         resolvers
//     }: {
//         path?: string
//         schema: string
//         resolvers: Record<string, Function>
//     }
// ) => {
//     const gqlSchema = buildSchema(schema)

//     return app.post(
//         path,
//         (context) =>
//             gql({
//                 operationName: context.body.operationName,
//                 schema: gqlSchema,
//                 rootValue: resolvers,
//                 source: context.body?.query,
//                 variableValues: context.body?.variables
//             }),
//         {
//             schema: {
//                 body: t.Object({
//                     operationName: t.Optional(t.String()),
//                     query: t.String(),
//                     variables: t.Optional(t.Object({}))
//                 })
//             }
//         }
//     )
// }

// export default graphql
