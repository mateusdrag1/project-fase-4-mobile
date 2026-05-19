import { Teacher } from '../entities/Teacher';

export interface PersonInput {
  name: string;
  email: string;
  password?: string;
}

export interface ITeacherRepository {
  list(): Promise<Teacher[]>;
  create(input: PersonInput): Promise<Teacher>;
  update(id: string, input: Omit<PersonInput, 'password'>): Promise<Teacher>;
  remove(id: string): Promise<void>;
}
