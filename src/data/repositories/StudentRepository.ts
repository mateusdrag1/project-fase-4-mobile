import { IStudentRepository } from '../../domain/repositories/IStudentRepository';
import { PersonInput } from '../../domain/repositories/ITeacherRepository';
import { Student } from '../../domain/entities/Student';
import { api } from '../../infra/http/api';

export class StudentRepository implements IStudentRepository {
  async list(): Promise<Student[]> {
    const { data } = await api.get<Student[]>('/students');
    return data;
  }

  async create(input: PersonInput): Promise<Student> {
    const { data } = await api.post<Student>('/students', input);
    return data;
  }

  async update(id: string, input: Omit<PersonInput, 'password'>): Promise<Student> {
    const { data } = await api.put<Student>(`/students/${id}`, input);
    return data;
  }

  async remove(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  }
}
