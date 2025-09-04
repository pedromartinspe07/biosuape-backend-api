BioSuape App - Backend
Visão Geral

Este repositório contém o backend do aplicativo BioSuape, uma API RESTful desenvolvida para suportar o aplicativo móvel de monitoramento ambiental. A API foi construída utilizando Node.js, Express, e TypeScript, e se conecta a um banco de dados MongoDB.

A arquitetura do projeto foi projetada para ser modular e escalável, utilizando middlewares para autenticação (JWT) e validação de dados, e controladores para gerenciar a lógica de negócios de cada rota.
Principais Funcionalidades

    Autenticação de Usuários: Registro e login de usuários com senhas seguras (hashing com bcrypt) e proteção de rotas via JWT (JSON Web Tokens).

    Gerenciamento de Ocorrências: Permite que os usuários submetam, visualizem e gerenciem ocorrências de bioindicadores. Os dados incluem localização geográfica, data, observações e pH/temperatura da água.

    Catálogo de Bioindicadores: Gerencia uma lista de bioindicadores com informações detalhadas, como nome científico, nome popular e função bioindicadora.

    Geração de Relatórios: Capacidade de gerar relatórios e análises a partir dos dados de ocorrências, com informações formatadas para visualização em gráficos.

    Mapa de Calor: Endpoint público para gerar dados de mapa de calor baseados nas ocorrências, permitindo visualizar a densidade de eventos sem a necessidade de autenticação.

    Segurança e Validação: Utilização de middlewares para garantir a segurança da API (Helmet, CORS) e validar os dados de entrada (express-validator), protegendo contra ataques e entradas inválidas.

Estrutura do Projeto

.
├── src/
│   ├── config/             # Configurações do banco de dados (MongoDB)
│   ├── controllers/        # Lógica de negócios para cada rota (CRUD)
│   ├── middleware/         # Middlewares para autenticação e validação
│   ├── models/             # Esquemas do Mongoose para os dados (User, Ocorrencia, etc.)
│   ├── routes/             # Definição das rotas da API
│   ├── utils/              # Funções utilitárias (tratamento de erros, etc.)
│   └── server.ts           # Ponto de entrada da aplicação
└── package.json            # Dependências e scripts

Instalação e Execução
Pré-requisitos

    Node.js (versão 18.x ou superior)

    MongoDB (local ou hospedado)

Passos

    Clone este repositório:

    git clone [https://github.com/pedromartss007/biosuape-backend.git](https://github.com/pedromartss007/biosuape-backend.git)
    cd biosuape-backend

    Instale as dependências:

    npm install

    Crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente. Exemplo:

    PORT=3000
    MONGODB_URI=mongodb://[seu-usuario]:[sua-senha]@localhost:27017/biosuape
    JWT_SECRET=sua_chave_secreta_aqui

    Para iniciar o servidor em modo de desenvolvimento:

    npm run dev

    Para compilar e iniciar o servidor em produção:

    npm run build
    npm start

A API estará disponível em http://localhost:3000 (ou na porta que você configurou).
Rotas da API

As rotas da API estão definidas no arquivo src/routes/api.ts e são prefixadas com /api/v1.

    POST /api/v1/register: Registra um novo usuário.

    POST /api/v1/login: Autentica um usuário e retorna um token JWT.

    GET /api/v1/mapa-calor: Retorna dados de ocorrências para o mapa de calor.

    POST /api/v1/ocorrencias: (Protegida) Cria uma nova ocorrência.

    GET /api/v1/ocorrencias: (Protegida) Lista todas as ocorrências.

    GET /api/v1/relatorio/:bioindicadorId: (Protegida) Gera um relatório de ocorrências para um bioindicador específico.

Contribuindo

Se você tiver alguma sugestão de melhoria ou encontrar algum problema, sinta-se à vontade para abrir uma issue ou um pull request.
Licença

Este projeto está sob a licença MIT License.