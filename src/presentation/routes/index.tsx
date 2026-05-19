import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { HomeScreen } from '../screens/Home';
import { PostDetailsScreen } from '../screens/PostDetails';
import { CreatePostScreen } from '../screens/CreatePost';
import { EditPostScreen } from '../screens/EditPost';
import { ProfileScreen } from '../screens/Profile';
import { TeachersScreen } from '../screens/Teachers';
import { StudentsScreen } from '../screens/Students';
import { PersonFormScreen } from '../screens/PersonForm';
import { LoginScreen } from '../screens/Login';
import { RegisterScreen } from '../screens/Register';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  const { isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        <Stack.Screen name="EditPost" component={EditPostScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Teachers" component={TeachersScreen} />
        <Stack.Screen name="Students" component={StudentsScreen} />
        <Stack.Screen name="PersonForm" component={PersonFormScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
