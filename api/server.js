// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')

const server = jsonServer.create()
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Middleware para processar o body das requisições
server.use(jsonServer.bodyParser)

// Endpoint personalizado para atualizar quizz_questions.json
server.put('/update', (req, res) => {
  try {
    const quizPath = path.join('quizz_questions.json')
    fs.writeFileSync(quizPath, JSON.stringify(req.body, null, 2), 'utf-8')
    res.status(200).json({ success: true, message: 'Quiz atualizado com sucesso!' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar o quiz', error: error.message })
  }
})

// Endpoint para obter o conteúdo do quizz_questions.json
server.get('/quizz', (req, res) => {
  try {
    const quizPath = path.join('quizz_questions.json')
    const quizData = fs.readFileSync(quizPath, 'utf-8')
    res.status(200).json(JSON.parse(quizData))
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao ler o quiz', error: error.message })
  }
})

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  server.listen(3000, () => {
    console.log('JSON Server is running')
  })
}

// Export the Server API
module.exports = server
