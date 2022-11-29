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

//buscando uma conta 
app.get("/statement/:cpf", (request, response) =>{
  const {cpf} = request.params
  const customer = customers.find((customer) => customer.cpf === cpf)

  if(!customer){
    
  }

  return response.json(customer.statement)
})

app.listen(3333)