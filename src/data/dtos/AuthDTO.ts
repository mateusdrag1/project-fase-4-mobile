export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponseDTO {
  token: string;
  user: UserDTO;
}
