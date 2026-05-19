import { IAuthRepository, LoginResult } from '../repositories/IAuthRepository';

export class AuthenticateUser {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(email: string, password: string): Promise<LoginResult> {
    return this.authRepo.login(email, password);
  }
}
