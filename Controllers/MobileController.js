const express=require("express")
const router=express.Router()

const MobileModel=require("../Models/Mobilemodels")
const AuthVerify=require("./middleware/Verify")
const UserVerify=require("./middleware/Userid")


router.post("/mobile",AuthVerify,(req,res)=>{
    const newMobile=new MobileModel({
        model:req.body.model,
        price:req.body.price,
        img:req.body.img,
        companyname:req.body.companyname
    })

    newMobile.save().then((result)=>{
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


router.put("/editproduct/:id",AuthVerify,(req,res)=>{
    MobileModel.findOneAndUpdate({_id:req.params.id},{
        $set:req.body
    }).then((result)=>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(400).json({message:"no product found"})
        }
    }).catch((err)=>{
        res.status(500).json({message:"something went wrong"})
        console.log(err)
    })
})


router.delete("/deleteproduct/:id",(req,res)=>{
    MobileModel.deleteOne({_id:req.params.id}).then((result)=>{
        if(result){
            res.status(200).json({message:"Deleted"})
        }else{
            res.status(400).json({message:"no product found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})



router.get("/mobiles",AuthVerify,UserVerify,(req,res)=>{
    MobileModel.find().then((result)=>{
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

router.get("/mobile/:id",AuthVerify,(req,res)=>{
        MobileModel.findOne({_id:req.params.id}).then((result)=>{
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