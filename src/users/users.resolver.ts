import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { CreateUserInput } from './dto/create-user.input'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'findAllUsers' })
  findAll() {
    return this.usersService.findAll()
  }

  @Query(() => User, { name: 'findUserById' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id)
  }

  @Mutation(() => User, { name: 'createUser' })
  create(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input)
  }
}
