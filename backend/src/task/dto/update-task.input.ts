import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateTaskInput } from './create-task.input';
import { TaskStatus } from '../entities/task.entity';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  @Field(() => ID)
  id: string;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;
}
