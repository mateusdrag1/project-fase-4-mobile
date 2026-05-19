import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../routes/types';

const CATEGORIES = ['Educação', 'Tecnologia', 'Comunicados', 'Eventos', 'Dicas de Estudo'];

const schema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  description: z.string().min(5, 'Resumo muito curto'),
  content: z.string().min(10, 'Conteúdo muito curto'),
  category: z.string(),
  published: z.boolean(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreatePost'>;
};

export function CreatePostScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState(0);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', content: '', category: CATEGORIES[0], published: true },
  });

  const published = watch('published');

  async function onSubmit({ title, description, content, category, published: pub }: FormData) {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }
    setIsLoading(true);
    try {
      await createPost({ title, author: user.name, description, content, category, published: pub });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setIsLoading(false);
    }
  }

  function cycleCategory() {
    const next = (categoryIndex + 1) % CATEGORIES.length;
    setCategoryIndex(next);
    setValue('category', CATEGORIES[next]);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Novo Post" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input label="Título" placeholder="Ex: Introdução ao React" value={value} onChangeText={onChange} error={errors.title?.message} />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input label="Resumo" placeholder="Do que se trata esse post?" value={value} onChangeText={onChange} error={errors.description?.message} multiline style={styles.textAreaSmall} />
          )}
        />

        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, value } }) => (
            <Input label="Conteúdo" placeholder="Escreva o conteúdo detalhado..." value={value} onChangeText={onChange} error={errors.content?.message} multiline style={styles.textArea} />
          )}
        />

        <View style={styles.row}>
          <View style={styles.categoryWrapper}>
            <Text style={styles.label}>Categoria</Text>
            <Button title={CATEGORIES[categoryIndex]} variant="outline" onPress={cycleCategory} style={styles.categoryBtn} />
          </View>

          <View style={styles.publishedWrapper}>
            <Text style={styles.label}>Publicado</Text>
            <View style={styles.switchRow}>
              <Switch
                value={published}
                onValueChange={(v) => setValue('published', v)}
                trackColor={{ false: '#D1D5DB', true: '#6C63FF' }}
                thumbColor="#fff"
              />
              <Text style={styles.switchLabel}>{published ? 'Sim' : 'Rascunho'}</Text>
            </View>
          </View>
        </View>

        <Button title="Publicar Post" onPress={handleSubmit(onSubmit)} isLoading={isLoading} style={styles.submitBtn} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 40 },
  textAreaSmall: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
  textArea: { height: 180, textAlignVertical: 'top', paddingTop: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  categoryWrapper: { flex: 1 },
  publishedWrapper: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  categoryBtn: { height: 44 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 44 },
  switchLabel: { fontSize: 14, color: '#374151' },
  submitBtn: { marginTop: 8 },
});
