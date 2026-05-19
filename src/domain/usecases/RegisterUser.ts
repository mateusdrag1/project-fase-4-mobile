import { IAuthRepository } from '../repositories/IAuthRepository';

export class RegisterUser {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(name: string, email: string, password: string): Promise<void> {
    return this.authRepo.register(name, email, password);
  }
}
