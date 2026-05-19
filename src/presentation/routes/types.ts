export type RootStackParamList = {
  Home: undefined;
  PostDetails: { postId: string };
  CreatePost: undefined;
  EditPost: { postId: string };
  Profile: undefined;
  Teachers: undefined;
  Students: undefined;
  PersonForm: {
    type: 'teacher' | 'student';
    id?: string;
    name?: string;
    email?: string;
  };
  Login: { redirect?: keyof RootStackParamList } | undefined;
  Register: undefined;
};
