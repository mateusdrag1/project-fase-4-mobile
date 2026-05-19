import { User } from '../entities/User';

export interface LoginResult {
  token: string;
  user: User;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<LoginResult>;
  register(name: string, email: string, password: string): Promise<void>;
}
