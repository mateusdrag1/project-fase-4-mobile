import { useState, useCallback } from 'react';
import { Student } from '../../domain/entities/Student';
import { PersonInput } from '../../domain/repositories/ITeacherRepository';
import { StudentRepository } from '../../data/repositories/StudentRepository';

const repo = new StudentRepository();

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await repo.list();
      setStudents(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (input: PersonInput) => {
    const student = await repo.create(input);
    setStudents((prev) => [...prev, student]);
    return student;
  }, []);

  const updateStudent = useCallback(async (id: string, input: Omit<PersonInput, 'password'>) => {
    const updated = await repo.update(id, input);
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }, []);

  const deleteStudent = useCallback(async (id: string) => {
    await repo.remove(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { students, isLoading, error, fetchStudents, createStudent, updateStudent, deleteStudent };
}
