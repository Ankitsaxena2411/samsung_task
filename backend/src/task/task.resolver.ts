import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TaskResolver {
  @Query(() => String)
  hello() {
    return 'Backend is working 🚀';
  }
}
