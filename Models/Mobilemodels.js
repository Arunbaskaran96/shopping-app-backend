const mongoose=require("mongoose")

const Mobilemodel=mongoose.Schema({
    model:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    },
    companyname:{
        type:String,
        required:true
    }
})


module.exports=mongoose.model("mobiles",Mobilemodel)