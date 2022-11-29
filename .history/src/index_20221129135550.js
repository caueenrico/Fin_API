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




app.listen(3333)