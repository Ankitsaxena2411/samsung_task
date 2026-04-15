import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return this.taskService.create(createTaskInput);
  }

  @Query(() => [Task], { name: 'tasks' })
  async findAll(
    @Args('status', { type: () => TaskStatus, nullable: true })
    status?: TaskStatus,
  ): Promise<Task[]> {
    return this.taskService.findAll(status);
  }

  @Query(() => Task, { name: 'task' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Mutation(() => Task)
  async updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    return this.taskService.update(updateTaskInput.id, updateTaskInput);
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.taskService.remove(id);
  }
}
