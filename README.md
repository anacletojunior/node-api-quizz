# Quiz API

API RESTful para um quiz de emoções, construída com JSON Server.

## Endpoints

- `GET /quizz` - Retorna todas as questões e resultados do quiz
- `PUT /update` - Atualiza as questões do quiz

## Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev-win
```

O servidor estará rodando em http://localhost:3000

## Deploy no Render

1. Faça fork deste repositório para sua conta GitHub
2. Acesse [render.com](https://render.com) e crie uma conta
3. No dashboard do Render, clique em "New +" e selecione "Web Service"
4. Conecte sua conta GitHub e selecione o repositório
5. Configure o serviço:
   - Name: escolha um nome para seu serviço
   - Region: escolha a região mais próxima
   - Branch: main
   - Runtime: Docker
   - Instance Type: Free
   - Build Command: deixe em branco (usa Dockerfile)
   - Start Command: deixe em branco (usa Dockerfile)

O Render irá automaticamente detectar o Dockerfile e fazer o deploy.

## Tecnologias

- Node.js
- JSON Server
- Docker
