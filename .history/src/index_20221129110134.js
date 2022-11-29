const express = require("express")
const {v4: uuidv4} = require("uuid")

const app = express()
app.use(express)

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */

app.post("/account", (request,response)=>{
  const {cpf, name} = request.body;
  const id = uuidv4()


})

app.listen(3333)