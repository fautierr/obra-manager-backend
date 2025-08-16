import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserInput } from './dto/create-user.input'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepo.find()
    return users
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException(`User with ID ${id} not found`)
    return user
  }

  async create(input: CreateUserInput): Promise<User> {
    const createUser = this.usersRepo.create(input)
    const user = await this.usersRepo.save(createUser)
    return user
  }
}
