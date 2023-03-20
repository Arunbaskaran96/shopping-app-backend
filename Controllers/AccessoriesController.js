const express=require("express")
const AccessoriesModel = require("../Models/AccessoriesModel")
const router=express.Router()

const AuthVerify=require("./middleware/Verify")


router.post("/accessories",AuthVerify,(req,res)=>{
    const newAccessories=new AccessoriesModel({
        model:req.body.model,
        price:req.body.price,
        img:req.body.img,
        companyname:req.body.companyname
    })

    newAccessories.save().then((result)=>{
        if(result){
            res.status(200).json({message:"created"})
        }else{
            res.status(400).json({message:"no item addes"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.get("/accessorieses",AuthVerify,(req,res)=>{
    AccessoriesModel.find().then((result)=>{
        if(result.length>0){
            res.status(200).json(result)
        }else{
            res.status(200).json({message:"no item found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.get("/accessorieses/:id",AuthVerify,(req,res)=>{
    AccessoriesModel.findOne({_id:req.params.id}).then((result)=>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(200).json({message:"no item found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.put("/accessorieses/:id",AuthVerify,(req,res)=>{
    AccessoriesModel.findOneAndUpdate({_id:req.params.id},{
        $set:req.body
    }).then((result)=>{
        if(result){
            res.status(200).json({message:"updated"})
        }else{
            res.status(200).json({message:"no item found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.delete("/accessorieses/:id",AuthVerify,(req,res)=>{
    AccessoriesModel.deleteOne({_id:req.params.id}).then((result)=>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(200).json({message:"no item found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})



module.exports=router