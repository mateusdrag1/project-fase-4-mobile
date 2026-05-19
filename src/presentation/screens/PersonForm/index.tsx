import React, { useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useTeachers } from '../../hooks/useTeachers';
import { useStudents } from '../../hooks/useStudents';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../routes/types';

const createSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
});

const editSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().optional(),
});

type CreateData = z.infer<typeof createSchema>;
type EditData = z.infer<typeof editSchema>;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PersonForm'>;
  route: RouteProp<RootStackParamList, 'PersonForm'>;
};

export function PersonFormScreen({ navigation, route }: Props) {
  const { type, id, name: initialName = '', email: initialEmail = '' } = route.params;
  const isEditing = !!id;

  const { createTeacher, updateTeacher } = useTeachers();
  const { createStudent, updateStudent } = useStudents();
  const [isLoading, setIsLoading] = useState(false);

  const label = type === 'teacher' ? 'Professor' : 'Aluno';

  const { control, handleSubmit, formState: { errors } } = useForm<EditData>({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
    defaultValues: { name: initialName, email: initialEmail, password: '' },
  });

  async function onSubmit({ name, email, password }: EditData) {
    setIsLoading(true);
    try {
      if (isEditing) {
        if (type === 'teacher') await updateTeacher(id!, { name, email });
        else await updateStudent(id!, { name, email });
      } else {
        if (type === 'teacher') await createTeacher({ name, email, password: password! });
        else await createStudent({ name, email, password: password! });
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title={isEditing ? `Editar ${label}` : `Novo ${label}`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Nome completo"
              placeholder="Ex: João Silva"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="E-mail"
              placeholder="email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />

        {!isEditing && (
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />
        )}

        <Button
          title={isEditing ? 'Salvar Alterações' : `Cadastrar ${label}`}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  submitBtn: { marginTop: 8 },
});
