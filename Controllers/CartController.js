const express=require("express")
const router=express.Router()

const CartModel=require("../Models/CartModel")
const Authverify=require("./middleware/Verify")
const UserVerify=require("./middleware/Userid")

const stripe=require("stripe")("sk_test_51MtVeMSFkq4vCHg8klSj5judKNaPYTLTPYUubzH1byFfppo8iE8MBrYwSac88dZ1WySCuPQinR0K0oLrOLvnoVfq00Zl1MU4jq")


router.post("/addcart",Authverify,UserVerify,(req,res)=>{
    // console.log(req.body)
    const newCartitem=new CartModel({
        userid:req.Uniqueid,
        model:req.body.model,
        price:req.body.price,
        img:req.body.img,
        companyname:req.body.companyname,
        productId:req.body._id
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


// router.get("/carts",Authverify,UserVerify,(req,res)=>{
//     const id=req.Uniqueid

//     const usercart= CartModel.aggregate([
//         {
//           '$match': {
//             'userid': id
//           }
//         },
//         {
//             $match:{
//                 "iscart":"yes"
//             }
//         }
//       ]).then((result)=>{
//         res.status(200).json(result)
//       }).catch(err=>{
//         console.log(err)
//         res.status(500).json({message:"something went wrong"})
//       })
// })

router.get("/carts",Authverify,UserVerify,async(req,res)=>{
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



router.get("/getanId",Authverify,UserVerify,async(req,res)=>{
    try {
        const result=await CartModel.find({})
    } catch (error) {
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    }
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


const storeItems=new Map([
    // [12,{price:1000,name:"phyton"}],
    // [13,{price:2000,name:"js"}],
    ["64100a2d48be85065d83164b",{price:7199900,name:"Apple iPhone 14 128GB (Product) RED"}],
    ["64100ab548be85065d83164d",{price:12299900,name:"Apple iPhone 14 pro 128GB (Product) GOLD"}],
    ["64100ae848be85065d83164f",{price:8999900,name:"Apple iPhone 14 Plus 256GB Blue"}],
    ["64100b0c48be85065d831651",{price:12499900,name:"Samsung Galaxy S23 Ultra 5G  256GB Storage"}],
    ["64100b2648be85065d831653",{price:3799000,name:"Samsung Galaxy S21 FE 5G (Graphite, 8GB, 128GB Storage)"}],
    ["64100b5948be85065d831655",{price:5799800,name:"Samsung Galaxy S22 5G (Phantom White, 8GB RAM, 128GB Storage"}],
    ["64100b7748be85065d831657",{price:4499900,name:"OnePlus 11R 5G (Galactic Silver, 16GB RAM, 256GB Storage)"}],
    ["64100b9048be85065d831659",{price:5128000,name:"Google Pixel 7 5G (Snow, 8GB Ram 128GB Storage)"}],
    ["641012a7c03692b0dc77ddfa",{price:154900,name:"boAt Rockerz 255"}],
    ["641012c1c03692b0dc77ddfc",{price:1790000,name:"Samsung Galaxy Buds2 Pro"}],
    ["641012f6c03692b0dc77de00",{price:49900,name:"Mi 5V Charger"}],
    ["6410130bc03692b0dc77de02",{price:39000,name:"pTron Solero M241 2.4A Micro USB Data & Charging Cable"}],
    ["64101321c03692b0dc77de04",{price:99800,name:"Ambrane Mobile Holding Tabletop Stand, 180 Perfect View"}],
    ["64101334c03692b0dc77de06",{price:154900,name:"Digitek DTR 550 LW (67 Inch) Tripod For DSLR"}],
    ["64101348c03692b0dc77de08",{price:169900,name:"Iphone 13"}],
    ["6410135cc03692b0dc77de0a",{price:11280,name:"Jabra Enterprise Store Evolve2 40"}],

])

// const storeItems=new Map([{
//     id:1,price:100000,name:"java"
// },
// {
//     id:2,price:400000,name:"js"
// }])

router.post("/create-checkout-session",async(req,res)=>{
    try {
       const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:"payment",
        line_items:req.body.items.map(item=>{
            const storeItem=storeItems.get(item.productId)
            return {
                price_data:{
                    currency:"inr",
                    product_data:{
                        name:storeItem.name
                    },
                    unit_amount:storeItem.price
                },
                quantity:1
            }
        }),
        success_url:"http://localhost:3000/payment",
        cancel_url:"http://localhost:3000/navbar/cart"
       })

        res.json({url:session.url})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
    }
})


module.exports=router