const jsonServer = require('json-server')
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const server = jsonServer.create()

// Função para validar a estrutura do JSON
function validateQuizJson(data) {
  const requiredFields = ['title', 'questions', 'results']
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Campo obrigatório '${field}' está faltando`)
    }
  }
  
  if (!Array.isArray(data.questions)) {
    throw new Error("O campo 'questions' deve ser um array")
  }
  
  if (typeof data.results !== 'object') {
    throw new Error("O campo 'results' deve ser um objeto")
  }
}

// Função para ler o arquivo JSON
function readJsonFile() {
  const dbPath = path.join(__dirname, '..', 'quizz_questions.json')
  const data = fs.readFileSync(dbPath, 'utf8')
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('Erro ao fazer parse do JSON:', error)
    throw new Error('Erro ao ler arquivo JSON')
  }
}

// Função para escrever no arquivo JSON
function writeJsonFile(data) {
  const dbPath = path.join(__dirname, '..', 'quizz_questions.json')
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8')
}

// Inicializa os dados
let quizData = readJsonFile()

// Habilitar CORS
server.use(cors())

// Usar middlewares padrão
server.use(jsonServer.defaults())

// Configurar body-parser com limite maior e tratamento de erros
server.use(jsonServer.bodyParser)

// Rota para obter o quiz
server.get('/quizz', (req, res) => {
  try {
    quizData = readJsonFile()
    res.json(quizData)
  } catch (error) {
    console.error('Erro no GET /quizz:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao ler o quiz',
      error: error.message 
    })
  }
})

// Middleware para validar JSON antes do update
server.use('/update', (req, res, next) => {
  console.log('Corpo da requisição recebido:', JSON.stringify(req.body, null, 2))
  
  try {
    // Verifica se o body é um objeto válido
    if (typeof req.body !== 'object' || req.body === null) {
      throw new Error('Body inválido: deve ser um objeto JSON')
    }
    
    // Valida a estrutura do JSON
    validateQuizJson(req.body)
    next()
  } catch (error) {
    console.error('Erro na validação do JSON:', error)
    res.status(400).json({ 
      success: false, 
      message: 'JSON inválido',
      error: error.message 
    })
  }
})

// Rota para atualizar o quiz
server.put('/update', (req, res) => {
  try {
    // Atualiza os dados em memória e no arquivo
    quizData = req.body
    writeJsonFile(quizData)
    
    res.json({ 
      success: true, 
      message: 'Quiz atualizado com sucesso!',
      data: quizData
    }) 
  } catch (error) {
    console.error('Erro no PUT /update:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao atualizar o quiz', 
      error: error.message 
    })
  }
})

// Inicia o servidor
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`JSON Server está rodando em http://localhost:${PORT}`)
})
