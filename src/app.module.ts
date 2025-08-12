import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'

import { typeOrmConfig } from './config/typeorm.config'
import { graphqlConfig } from './config/graphql.config'

import { ProjectsModule } from './projects/projects.module'
import appConfig from './config/app.config'
@Module({
  imports: [
    // Variables de entorno
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),

    // GraphQL
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: graphqlConfig,
    }),

    // Módulos de negocio
    ProjectsModule,
  ],
})
export class AppModule {}
