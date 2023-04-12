const express=require("express")
const router=express.Router()
var braintree=require("braintree")

const CartModel=require("../Models/CartModel")
const AuthVerify=require("./middleware/Verify")
const UserVerify=require("./middleware/Userid")
const OrderModel=require("../Models/Ordersmodel")


// router.put("/order/:id",AuthVerify,UserVerify,async(req,res)=>{
//     try {
//         const cartitem=await CartModel.findOneAndUpdate({_id:req.params.id},{
//             $set:req.body
//         })
//         res.status(200).json({message:"added to orders"})
//     } catch (error) {
//         console.log(error)
//     }
// })



router.get("/orders",AuthVerify,UserVerify,(req,res)=>{
    const id=req.Uniqueid
    const userorders=CartModel.aggregate([
        {
            $match:{
                userid:id
            }
        },
        {
            $match:{
                iscart:"no"
            }
        }
    ]).then((result)=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})

router.get("/allorders",AuthVerify,(req,res)=>{
    CartModel.find().populate("userid").then((result)=>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(200).json({message:"no orders found"})
        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})

router.get("/allorders/:id",AuthVerify,(req,res)=>{
    CartModel.findOne
    ({_id:req.params.id}).populate("userid").then((result)=>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(200).json({message:"no orders found"})
        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.post("/ordering",AuthVerify,UserVerify,async(req,res)=>{
    try {
        const newOrder=new OrderModel({
            userId:req.Uniqueid,
            productId:req.body.productId
        })
        await newOrder.save()
        res.status(200).json(newOrder)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"})
    }
})


router.get("/ordering",AuthVerify,UserVerify,async(req,res)=>{
    try {
        const result=await OrderModel.find().populate("productId")
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"})
    }
})

router.put("/orders",AuthVerify,UserVerify,async(req,res)=>{
    const order=req.query.order.split(",")
    // console.log(order)
    try {
        const result=await CartModel.updateMany({
            _id:order
        },{$set:req.body})
        res.status(200).json({message:"updated"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"})
    }
})

// var gateway = new braintree.BraintreeGateway({
//     environment: braintree.Environment.Sandbox,
//     merchantId: "ws337gpjkxjfm3cd",
//     publicKey: "tntb3vzrcq67grnb",
//     privateKey: "45d1d90914c54bcce947df9d77b0c1c8",
//   });


//   router.get("/braintree/token",async(req,res)=>{
//     try {
//         gateway.clientToken.generate({},function(err,response){
//             if(err){
//                 res.status(500).json({message:"something went wrong"})
//             }else{
//                 res.status(200).json(response)
//             }
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message:"something went wrong"})
//     }
//   })


//   router.post("/braintree/payment",AuthVerify,UserVerify,async(req,res)=>{
//     try {
//         const {cart,nonce}=req.body
//         let total=0
//         cart.map((i)=>total+parseInt(i.price))

//         let newTranscation=gateway.transaction.sale({
//             amount:total,
//             paymentMethodNonce:nonce,
//             options:{
//                 submitForSettlement:true
//             }
//         },
//         function(error,result){
//             if(result){
//                 const order=new OrderModel({
//                     productId:cart,
//                     payment:result,
//                     userId:req.Uniqueid
//                 })
//                 res.status(200).json({message:"worked"})
//             }else{
//                 console.log(error)
//                 res.status(500).json({message:"something went wrong"})
//             }
//         }
//         )
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({message:"something went wrong"})
//     }
//   })

module.exports=router