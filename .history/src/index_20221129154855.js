const { response } = require("express")
const express = require("express")
const {v4: uuidv4} = require("uuid")

const app = express()
app.use(express.json())

const customers = []

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */

//Middleware
function verifyExistsAccountCPF(request, response, next){
  const {cpf} = request.headers 
  const customer = customers.find((customer) => customer.cpf === cpf)

  if(!customer){
    return response.status(400).json({error: "Customer not exists!"})
  }

  request.customer = customer
  next()

}


function getBalance(statement){ 
  const balance = statement.reduce((acc, operation) =>{ //reduce é um método que recebe uma função e um valor inicial
    if(operation.type === "credit"){
      return acc + operation.amount
    } else {
      return acc - operation.amount
    }
  }, 0)

  return balance 
}

//criando uma nova conta 
app.post("/account", (request,response)=>{
  const {cpf, name} = request.body;
  
  const customersAlreadyExists = customers.some((customer) => customer.cpf === cpf)

  if(customersAlreadyExists){
    return response.status(400).json({error: "Customer already exists!"})
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  })

  return response.status(201).send()

})

//listando o extrato bancário
app.get("/statement", verifyExistsAccountCPF, (request, response) =>{
  const {customer} = request
  
  return response.json(customer.statement)
})

//criando depositos
app.post("/deposit",verifyExistsAccountCPF, (request, response) =>{
  const {description, amount} = request.body 

  const {customer} = request //pegando o customer do middleware

  const statementOperation = { //criando um objeto para armazenar as informações
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation) //adicionando o objeto no array

  return response.status(201).send()
})

//criando um saque
app.post("/withdraw",verifyExistsAccountCPF,(request, response) => {
  const { amount } = request.body
  const {customer} = request
  
  const balance = getBalance(customer.statement) //pegando o saldo

  if(balance < amount){ //verificando se o saldo é menor que o valor do saque
    return response.status(400).json({error: "saldo insuficiente"})
  }

  const statementOperation = { //criando um objeto para armazenar as informações
    amount,
    created_at: new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperation) 

  return response.status(201).send()
})

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response)=>{

   
    
  const {customer} = request;
  const {date} = request.query;

      
  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(
  (statement)=>
  statement.created_at.toDateString() === 
  new Date(dateFormat).toDateString()
  
);
  

  return response.json(statement);

  
});

app.listen(3333)