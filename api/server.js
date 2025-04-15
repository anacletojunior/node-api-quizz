// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const server = jsonServer.create()

// Importando diretamente o arquivo JSON para uso na Vercel
// Isso evita problemas com sistema de arquivos somente leitura
const quizzData = require('../quizz_questions.json')

// Configuração do JSON Server
const router = jsonServer.router(quizzData)
const middlewares = jsonServer.defaults()

// Habilitar CORS para todas as origens
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

server.use(middlewares)

// Middleware para processar o body das requisições
server.use(jsonServer.bodyParser)

// Endpoint personalizado para atualizar quizz_questions.json
// Na Vercel, não podemos escrever em arquivos diretamente, então isso funcionará apenas em desenvolvimento local
server.put('/update', (req, res) => {
  try {
    // Verificando se estamos em ambiente de produção (Vercel)
    if (process.env.VERCEL) {
      // No Vercel, podemos apenas simular uma atualização para a sessão atual
      Object.assign(quizzData, req.body)
      res.status(200).json({ success: true, message: 'Quiz atualizado na memória (ambiente Vercel)' })
    } else {
      // Em ambiente local, podemos escrever no arquivo
      const quizPath = path.join('quizz_questions.json')
      fs.writeFileSync(quizPath, JSON.stringify(req.body, null, 2), 'utf-8')
      res.status(200).json({ success: true, message: 'Quiz atualizado com sucesso!' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar o quiz', error: error.message })
  }
})

// Endpoint para obter o conteúdo do quizz_questions.json
server.get('/quizz', (req, res) => {
  try {
    // Retornamos os dados diretamente da variável, sem ler o arquivo
    res.status(200).json(quizzData)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao ler o quiz', error: error.message })
  }
})

// Log de todas as requisições
server.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Use default router
server.use(router)

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  server.listen(3000, () => {
    console.log('JSON Server is running on port 3000')
  })
}

// Export the Server API
module.exports = server
