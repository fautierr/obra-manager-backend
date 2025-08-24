import { BadRequestException } from '@nestjs/common'

export function validatePagination(limit: number, offset: number) {
  if (limit <= 0) {
    throw new BadRequestException(
      `Invalid pagination: limit must be greater than 0 (received ${limit})`,
    )
  }

  if (offset < 0) {
    throw new BadRequestException(
      `Invalid pagination: offset cannot be negative (received ${offset})`,
    )
  }
}
export function getPaginationParams(input: {
  limit?: number
  offset?: number
}) {
  const limit = input.limit && input.limit > 0 ? input.limit : 10
  const offset = input.offset && input.offset >= 0 ? input.offset : 0

  return { limit, offset }
}
