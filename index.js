const express=require("express")

const server=express()

require("./Connection/Configure")

const app=require("./app")
server.use("/",app)

server.listen(8000)