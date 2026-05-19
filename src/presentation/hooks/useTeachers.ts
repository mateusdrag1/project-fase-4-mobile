import { useState, useCallback } from 'react';
import { Teacher } from '../../domain/entities/Teacher';
import { PersonInput } from '../../domain/repositories/ITeacherRepository';
import { TeacherRepository } from '../../data/repositories/TeacherRepository';

const repo = new TeacherRepository();

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await repo.list();
      setTeachers(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTeacher = useCallback(async (input: PersonInput) => {
    const teacher = await repo.create(input);
    setTeachers((prev) => [...prev, teacher]);
    return teacher;
  }, []);

  const updateTeacher = useCallback(async (id: string, input: Omit<PersonInput, 'password'>) => {
    const updated = await repo.update(id, input);
    setTeachers((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTeacher = useCallback(async (id: string) => {
    await repo.remove(id);
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { teachers, isLoading, error, fetchTeachers, createTeacher, updateTeacher, deleteTeacher };
}
