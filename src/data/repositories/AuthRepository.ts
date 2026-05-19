import { IAuthRepository, LoginResult } from '../../domain/repositories/IAuthRepository';
import { api } from '../../infra/http/api';
import { LoginResponseDTO } from '../dtos/AuthDTO';

export class AuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<LoginResult> {
    const { data } = await api.post<LoginResponseDTO>('/login', { email, password });
    return { token: data.token, user: data.user };
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await api.post('/register', { name, email, password });
  }
}
