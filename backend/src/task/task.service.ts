import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task, TaskStatus } from './entities/task.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  create(createTaskInput: CreateTaskInput): Task {
    const task: Task = {
      id: uuidv4(),
      title: createTaskInput.title,
      description: createTaskInput.description,
      status: TaskStatus.TODO,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(task);
    return task;
  }

  findAll(status?: TaskStatus): Task[] {
    if (status) {
      return this.tasks.filter((task) => task.status === status);
    }
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  update(id: string, updateTaskInput: UpdateTaskInput): Task {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updateTaskInput,
    };
    
    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  remove(id: string): boolean {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(taskIndex, 1);
    return true;
  }
}
