import { Student } from '../entities/Student';
import { PersonInput } from './ITeacherRepository';

export interface IStudentRepository {
  list(): Promise<Student[]>;
  create(input: PersonInput): Promise<Student>;
  update(id: string, input: Omit<PersonInput, 'password'>): Promise<Student>;
  remove(id: string): Promise<void>;
}
