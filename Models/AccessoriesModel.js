const mongoose=require("mongoose")

const Accessoriesmodel=mongoose.Schema({
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
    },

})


module.exports=mongoose.model("accessories",Accessoriesmodel)