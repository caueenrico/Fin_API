const { response } = require("express")
const express = require("express")
const {v4: uuidv4} = require("uuid")

const app = express()

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */

app.post("/account", (request,response)=>{
  const {cpf, name} = request.body;
  const id = 


})

app.listen(3333)