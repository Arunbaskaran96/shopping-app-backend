const express=require("express")
const router=express.Router()

const CartModel=require("../Models/CartModel")
const AuthVerify=require("./middleware/Verify")
const UserVerify=require("./middleware/Userid")


router.put("/order/:id",AuthVerify,UserVerify,async(req,res)=>{
    try {
        const cartitem=await CartModel.findOneAndUpdate({_id:req.params.id},{
            $set:req.body
        })
        res.status(200).json({message:"added to orders"})
    } catch (error) {
        console.log(error)
    }
})



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



module.exports=router