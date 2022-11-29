const { response } = require("express")
const express = require("express")

const app = express()

app.get("/", (require, response)=>{
  return response.json()
})

app.listen(3333)