import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskInput: CreateTaskInput): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskInput,
      status: createTaskInput.status ?? TaskStatus.TODO,
    });
    return this.taskRepository.save(task);
  }

  async findAll(status?: TaskStatus): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    if (status) {
      query.where('task.status = :status', { status });
    }
    return query.getMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskInput: UpdateTaskInput): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskInput);
    return this.taskRepository.save(task);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return true;
  }
}
