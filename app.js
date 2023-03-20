const express=require("express")
const app=express()
const bodyparser=require("body-parser")
const cors=require("cors")

app.use(bodyparser.json())
app.use(cors())
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const SignupController=require("./Controllers/Users/SignupController")
const LoginController=require("./Controllers/Users/SigninController")
const MobileController=require("./Controllers/MobileController")
const AccessoriesController=require("./Controllers/AccessoriesController")
const CartController=require("./Controllers/CartController")
const OrderController=require("./Controllers/OrderController")


app.use("/",SignupController)
app.use("/",LoginController)
app.use("/",MobileController)
app.use("/",AccessoriesController)
app.use("/",CartController)
app.use("/",OrderController)

module.exports=app