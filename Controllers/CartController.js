const express=require("express")
const router=express.Router()

const CartModel=require("../Models/CartModel")
const Authverify=require("./middleware/Verify")
const UserVerify=require("./middleware/Userid")


router.post("/addcart",Authverify,UserVerify,(req,res)=>{
    const newCartitem=new CartModel({
        userid:req.Uniqueid,
        model:req.body.model,
        price:req.body.price,
        img:req.body.img,
        companyname:req.body.companyname
    })

    newCartitem.save().then((result)=>{
        if(result){
            res.status(200).json({message:"Created"})
        }else{
            res.status(400).json({message:"no data found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"Something went wrong"})
    })
})


router.get("/carts",Authverify,UserVerify,(req,res)=>{
    const id=req.Uniqueid

    const usercart= CartModel.aggregate([
        {
          '$match': {
            'userid': id
          }
        },
        {
            $match:{
                "iscart":"yes"
            }
        }
      ]).then((result)=>{
        res.status(200).json(result)
      }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
      })
})


router.delete("/cartdelete/:id",async(req,res)=>{
    try {
        const product=await CartModel.findOne({_id:req.params.id})

        if(product){
          await product.delete()
        }else{
            res.status(400).json({message:"no product found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
    }
})


module.exports=router