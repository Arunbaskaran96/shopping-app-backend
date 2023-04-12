const mongoose=require("mongoose")

const OrderModel=mongoose.Schema({
    userId:{
        ref:"user",
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    productId:{
        ref:"cart",
        type:Array,
        required:true
    },
    payment:{}
})


module.exports=mongoose.model("order",OrderModel)