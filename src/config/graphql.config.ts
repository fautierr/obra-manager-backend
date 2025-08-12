import { ApolloDriverConfig } from '@nestjs/apollo'
import { join } from 'path'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

export const graphqlConfig = (): ApolloDriverConfig => ({
  autoSchemaFile: join(
    process.cwd(),
    process.env.GRAPHQL_SCHEMA || 'src/schema.gql',
  ),
  playground: false,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
})
