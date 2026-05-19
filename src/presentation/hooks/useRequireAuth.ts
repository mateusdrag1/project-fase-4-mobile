import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes/types';
import { useAuth } from './useAuth';

export function useRequireAuth() {
  const { token } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function requireAuth(action: () => void) {
    if (!token) {
      navigation.navigate('Login');
      return;
    }
    action();
  }

  return { requireAuth, isAuthenticated: !!token };
}
