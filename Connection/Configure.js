const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://admin:project2@cluster0.9ygqbt3.mongodb.net/?retryWrites=true&w=majority").then(result=>{
    console.log("connected")
}).catch(err=>{
    console.log("error",err)
})


