const mongoose=require("mongoose")

const CartModel=mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
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
    iscart:{
        type:String,
        default:"yes"
    }
})

module.exports=mongoose.model("cart",CartModel)