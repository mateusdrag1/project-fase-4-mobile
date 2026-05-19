# Blog Acadêmico — Mobile

Aplicativo mobile desenvolvido em React Native com Expo para a **Fase 4** do projeto FIAP. Trata-se de um blog acadêmico que permite a professores publicarem conteúdo e a alunos e visitantes consumirem esse conteúdo, comentarem e curtirem posts.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Camadas e Responsabilidades](#camadas-e-responsabilidades)
- [Decisões Arquiteturais](#decisões-arquiteturais)
- [Design e UI](#design-e-ui)
- [Tecnologias](#tecnologias)
- [Como Executar](#como-executar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## Visão Geral

O aplicativo serve como cliente mobile de uma API REST (backend separado). A autenticação é baseada em JWT, e o controle de acesso é feito por **papéis de usuário** (`teacher` / `student`). Visitantes não autenticados podem navegar e ler posts, mas precisam fazer login para curtir ou comentar.

---

## Funcionalidades

| Funcionalidade | Visitante | Aluno | Professor |
|---|:-:|:-:|:-:|
| Listar posts | ✓ | ✓ | ✓ |
| Buscar posts | ✓ | ✓ | ✓ |
| Ler post completo | ✓ | ✓ | ✓ |
| Curtir post | — | ✓ | ✓ |
| Comentar post | — | ✓ | ✓ |
| Criar post | — | — | ✓ |
| Editar post | — | — | ✓ |
| Excluir post | — | — | ✓ |
| Gerenciar professores | — | — | ✓ |
| Gerenciar alunos | — | — | ✓ |

Outras características:
- Busca com debounce de 400 ms para evitar requisições excessivas
- Pull-to-refresh na listagem de posts
- Atualização otimista de curtidas (UI responde antes da confirmação da API)
- Persistência de sessão via AsyncStorage (login sobrevive a reinicializações do app)
- Login e cadastro apresentados como modais sobre a tela corrente

---

## Arquitetura

O projeto segue os princípios da **Clean Architecture**, organizando o código em camadas concêntricas onde as dependências sempre apontam de fora para dentro. A camada de domínio não conhece nenhuma biblioteca de infraestrutura ou de UI.

```
┌──────────────────────────────────────────────┐
│                 Presentation                 │  ← Telas, Componentes, Hooks, Rotas, Contextos
├──────────────────────────────────────────────┤
│                    Data                      │  ← Repositórios concretos, DTOs, Mappers
├──────────────────────────────────────────────┤
│                 Infrastructure               │  ← HTTP (Axios), Storage (AsyncStorage)
├──────────────────────────────────────────────┤
│                   Domain                     │  ← Entidades, Interfaces, Use Cases
└──────────────────────────────────────────────┘
              ▲ dependências apontam para cima
```

### Fluxo de uma operação (ex: listar posts)

```
HomeScreen
  └─ usePosts (hook)
       └─ PostRepository (data) implements IPostRepository (domain)
            └─ api (axios) → GET /posts
                 └─ PostMapper → Post (entidade de domínio)
```

---

## Estrutura de Diretórios

```
src/
├── core/
│   ├── constants/
│   │   └── api.ts              # URL base da API
│   ├── errors/
│   │   └── AppError.ts         # Erro de domínio tipado
│   └── types/
│       └── index.ts            # Tipos utilitários globais (Nullable, AsyncResult)
│
├── domain/
│   ├── entities/               # Modelos puros de negócio
│   │   ├── Comment.ts
│   │   ├── Like.ts
│   │   ├── Post.ts
│   │   ├── Student.ts
│   │   ├── Teacher.ts
│   │   └── User.ts
│   ├── repositories/           # Contratos (interfaces) dos repositórios
│   │   ├── IAuthRepository.ts
│   │   ├── ICommentRepository.ts
│   │   ├── ILikeRepository.ts
│   │   ├── IPostRepository.ts
│   │   ├── IStudentRepository.ts
│   │   └── ITeacherRepository.ts
│   └── usecases/               # Casos de uso (orquestram repositórios)
│       ├── AuthenticateUser.ts
│       ├── CreateComment.ts
│       ├── CreatePost.ts
│       ├── DeletePost.ts
│       ├── EditPost.ts
│       ├── ListPosts.ts
│       ├── ReadPost.ts
│       ├── RegisterUser.ts
│       ├── SearchPosts.ts
│       └── ToggleLike.ts
│
├── data/
│   ├── dtos/                   # Formatos de resposta da API
│   │   ├── AuthDTO.ts
│   │   └── PostDTO.ts
│   ├── mappers/                # Conversão DTO → Entidade de domínio
│   │   └── PostMapper.ts
│   └── repositories/           # Implementações concretas
│       ├── AuthRepository.ts
│       ├── CommentRepository.ts
│       ├── LikeRepository.ts
│       ├── PostRepository.ts
│       ├── StudentRepository.ts
│       └── TeacherRepository.ts
│
├── infra/
│   ├── http/
│   │   └── api.ts              # Instância do Axios + interceptors
│   └── storage/
│       └── StorageService.ts   # Wrapper sobre AsyncStorage
│
├── presentation/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── Button/
│   │   ├── EmptyState/
│   │   ├── Header/
│   │   ├── Input/
│   │   ├── Loading/
│   │   ├── PostCard/
│   │   └── SearchBar/
│   ├── contexts/
│   │   └── AuthContext.tsx     # Estado global de autenticação
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   ├── useRequireAuth.ts
│   │   ├── useStudents.ts
│   │   └── useTeachers.ts
│   ├── routes/
│   │   ├── index.tsx           # Navegador principal
│   │   └── types.ts            # Tipagem de parâmetros das rotas
│   └── screens/
│       ├── CreatePost/
│       ├── EditPost/
│       ├── Home/
│       ├── Login/
│       ├── PersonForm/
│       ├── PostDetails/
│       ├── Profile/
│       ├── Register/
│       ├── Students/
│       └── Teachers/
│
└── main/
    ├── App.tsx                 # Raiz da árvore de componentes
    └── providers/
        └── index.tsx           # Composição de providers globais
```

---

## Camadas e Responsabilidades

### Domain
Núcleo da aplicação, completamente independente de frameworks. Define:
- **Entidades**: contratos TypeScript puros (interfaces) que representam os modelos de negócio (`Post`, `User`, `Comment`, etc.)
- **Interfaces de repositório**: contratos que a camada de dados deve implementar (`IPostRepository`, `IAuthRepository`, etc.)
- **Use Cases**: classes que orquestram a lógica de negócio chamando repositórios via suas interfaces

### Data
Implementa os contratos definidos pelo domínio:
- **Repositórios concretos**: fazem chamadas HTTP via `api` e retornam entidades de domínio
- **DTOs**: tipagem dos payloads da API (podem diferir das entidades de domínio)
- **Mappers**: funções puras que convertem DTOs em entidades (`mapPost`, `mapComment`)

### Infrastructure
Fornece serviços técnicos transversais:
- **`api.ts`** (Axios): instância configurada com `baseURL`, `timeout` e dois interceptors — um de request (injeção do JWT) e um de response (normalização de erros)
- **`StorageService`**: wrapper sobre AsyncStorage que persiste token e dados do usuário entre sessões

### Presentation
Responsável pela interface e pelo estado de UI:
- **Screens**: cada tela é um componente funcional que recebe `navigation` e `route` tipados via React Navigation
- **Hooks**: encapsulam toda a lógica de estado e side effects (ex: `usePosts` gerencia `posts`, `isLoading`, `error` e as operações CRUD)
- **AuthContext**: estado global de autenticação acessível em qualquer tela via `useAuth()`
- **Routes**: define a pilha de navegação e aplica tipagem estática a cada rota via `RootStackParamList`
- **Components**: componentes de UI reutilizáveis sem estado de negócio próprio

### Main
Ponto de entrada que compõe providers e roteamento:
- `Providers` envolve o app com `SafeAreaProvider` e `AuthProvider`
- `Routes` configura o `NavigationContainer` e o `Stack.Navigator`

---

## Decisões Arquiteturais

### 1. Clean Architecture com inversão de dependências
**Por quê:** Isola a lógica de negócio de decisões de infraestrutura (qual biblioteca HTTP usar, como persistir dados). As interfaces de repositório no domínio permitem trocar implementações sem alterar use cases ou telas.

### 2. Repository Pattern
**Por quê:** Abstrai o acesso a dados atrás de um contrato. A camada de apresentação não sabe se os dados vêm de uma API, de um banco local ou de um mock, o que facilita testes e manutenção.

### 3. DTOs + Mappers
**Por quê:** A API pode retornar campos com nomes ou formatos diferentes do que a UI precisa. Os mappers criam um ponto único de conversão, evitando que detalhes da API vazem para a camada de domínio ou de apresentação.

### 4. React Context para autenticação
**Por quê:** O estado de autenticação (token, user, isLoading) é necessário em múltiplas telas e hooks. Context evita prop drilling e centraliza a lógica de restauração de sessão, login e logout em um único lugar.

### 5. Hooks de domínio (`usePosts`, `useAuth`)
**Por quê:** Mantêm os componentes de tela finos, delegando toda lógica de estado e chamadas a repositórios para hooks reutilizáveis. Isso também facilita compartilhar estado entre telas que exibem a mesma lista de posts.

### 6. React Hook Form + Zod
**Por quê:** `react-hook-form` minimiza re-renders em formulários usando refs em vez de estado controlado. `zod` fornece validação com schema tipado em TypeScript, eliminando a necessidade de validadores manuais e garantindo que os tipos inferidos do schema correspondam diretamente aos tipos dos campos do formulário.

### 7. Navegação tipada (TypeScript + RootStackParamList)
**Por quê:** Garantir em tempo de compilação que os parâmetros de cada rota estão corretos. Qualquer chamada a `navigation.navigate('PostDetails', { postId: ... })` com tipo errado ou faltando é capturada pelo compilador.

### 8. Interceptor de request para injeção de token
**Por quê:** Centraliza a lógica de autenticação HTTP em um único lugar. Nenhum repositório precisa saber como obter o token; o interceptor lê o AsyncStorage e injeta o header `Authorization` automaticamente.

### 9. Atualização otimista de curtidas
**Por quê:** Melhora a percepção de responsividade. O estado local é atualizado imediatamente ao toque, sem aguardar a confirmação da API. Em caso de erro, a operação pode ser revertida (comportamento futuro).

### 10. Modo visitante (sem login obrigatório)
**Por quê:** Reduz a barreira de entrada. O app é completamente utilizável para leitura sem autenticação. O hook `useRequireAuth` apresenta o modal de login somente quando o usuário tenta executar uma ação que requer autenticação (curtir, comentar).

### 11. Persistência de sessão com AsyncStorage
**Por quê:** Token e dados do usuário são salvos localmente. Ao abrir o app, `AuthProvider` restaura a sessão em segundo plano enquanto exibe um loading, evitando que o usuário precise fazer login a cada abertura.

---

## Design e UI

### Paleta de cores

| Papel | Hex |
|---|---|
| Primária (roxa) | `#6C63FF` |
| Fundo geral | `#F9FAFB` |
| Superfície (card) | `#FFFFFF` |
| Texto principal | `#111827` |
| Texto secundário | `#6B7280` |
| Destrutivo (vermelho) | `#EF4444` |
| Badge de categoria | `#EEF2FF` |
| Borda | `#D1D5DB` |

### Princípios de UI

- **Safe Area**: todas as telas respeitam as áreas seguras do dispositivo via `useSafeAreaInsets` e `SafeAreaProvider`, garantindo compatibilidade com notches e barras de navegação
- **Keyboard Avoiding**: telas com formulários usam `KeyboardAvoidingView` com comportamento `padding` no iOS para que o teclado não cubra os inputs
- **Feedback de carregamento**: estados de loading são comunicados via componente `<Loading />` (spinner centralizado) ou via `RefreshControl` no pull-to-refresh
- **Estado vazio**: a lista de posts exibe `<EmptyState />` quando não há resultados, evitando tela em branco
- **Acesso por papel**: o menu e as ações da UI se adaptam dinamicamente ao papel do usuário — professores veem botões de criar/editar/excluir e gerenciar pessoas; alunos e visitantes não
- **Modais para auth**: Login e Register são empilhados com `presentation: 'modal'`, permitindo que o usuário feche e volte ao conteúdo que estava navegando
- **Cores contextuais em comentários**: cada card de comentário tem uma borda esquerda roxa (`borderLeftColor: '#6C63FF'`) como detalhe visual de identidade

### Componentes reutilizáveis

| Componente | Descrição |
|---|---|
| `Button` | Suporta variantes `default`, `outline` e `danger`, estado de loading integrado |
| `Input` | Campo de texto com label, mensagem de erro e suporte a multiline |
| `Header` | Barra de topo com título e botão de voltar |
| `PostCard` | Card de post com título, autor, categoria, data, contador de curtidas e ação de like |
| `SearchBar` | Campo de busca com ícone |
| `Loading` | Spinner centralizado com fundo semitransparente |
| `EmptyState` | Mensagem de estado vazio para listas |

---

## Tecnologias

| Tecnologia | Versão | Papel |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0.33 | Toolchain e runtime |
| TypeScript | ~5.9.2 | Tipagem estática |
| React Navigation | 7.x | Navegação entre telas |
| React Hook Form | 7.x | Gerenciamento de formulários |
| Zod | 4.x | Validação com schema tipado |
| Axios | 1.x | Cliente HTTP |
| AsyncStorage | 1.x | Persistência local |
| react-native-safe-area-context | 5.x | Suporte a safe areas |
| react-native-screens | 4.x | Otimização de navegação nativa |

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- Android Studio com emulador configurado (ou dispositivo físico)
- Expo CLI (`npm install -g expo-cli`) — opcional, pode usar `npx`

### Instalação

```bash
npm install
```

### Iniciar em modo desenvolvimento

```bash
# Metro bundler + Expo Dev Tools
npm start

# Direto no Android
npm run android

# Direto no iOS (apenas macOS)
npm run ios
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (já existe um `.env` de exemplo):

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
```

| Variável | Descrição | Padrão |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | URL base da API REST | `http://localhost:3333` |

> **Nota:** `10.0.2.2` é o endereço que o emulador Android usa para acessar o `localhost` da máquina host. Para dispositivos físicos, use o IP local da sua máquina na rede Wi-Fi.

O prefixo `EXPO_PUBLIC_` é obrigatório para que a variável seja exposta ao bundle JavaScript pelo Expo.
