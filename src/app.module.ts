import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'

import { typeOrmConfig } from './config/typeorm.config'
import { graphqlConfig } from './config/graphql.config'

import { ProjectsModule } from './projects/projects.module'
import { UsersModule } from './users/users.module'
import { CategoriesModule } from './categories/categories.module'
import { ProjectStatusesModule } from './project-statuses/project-statuses.module'
import { UnitsModule } from './units/units.module'
import { MaterialsModule } from './materials/materials.module'
import { ProjectMaterialsModule } from './project-materials/project-materials.module'
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
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        graphqlConfig(configService),
    }),

    // Módulos de negocio
    ProjectsModule,

    UsersModule,

    CategoriesModule,

    ProjectStatusesModule,

    UnitsModule,

    MaterialsModule,

    ProjectMaterialsModule,
  ],
})
export class AppModule {}
