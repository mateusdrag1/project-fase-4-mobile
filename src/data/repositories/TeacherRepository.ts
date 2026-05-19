import { ITeacherRepository, PersonInput } from '../../domain/repositories/ITeacherRepository';
import { Teacher } from '../../domain/entities/Teacher';
import { api } from '../../infra/http/api';

export class TeacherRepository implements ITeacherRepository {
  async list(): Promise<Teacher[]> {
    const { data } = await api.get<Teacher[]>('/teachers');
    return data;
  }

  async create(input: PersonInput): Promise<Teacher> {
    const { data } = await api.post<Teacher>('/teachers', input);
    return data;
  }

  async update(id: string, input: Omit<PersonInput, 'password'>): Promise<Teacher> {
    const { data } = await api.put<Teacher>(`/teachers/${id}`, input);
    return data;
  }

  async remove(id: string): Promise<void> {
    await api.delete(`/teachers/${id}`);
  }
}
