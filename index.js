//wring first api in expess
const express=require("express"); 
const mongoose =require('mongoose');
//where express in const is a variable name.
//we are just importing the express
const authRouter=require("./routes/auth");
const adminRouter = require('./routes/admin');
const productRouter = require("./routes/products");
const userRouter=require("./routes/user");
//INIT
const PORT= 3000;
const app=express();
const DB='mongodb+srv://someshraj1595159:Somesh1595159@cluster0.mmgipua.mongodb.net/?retryWrites=true&w=majority';


 
//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter)
app.use(productRouter);
app.use(userRouter);


//connections
mongoose.connect(DB).then(()=>{
    console.log("connection successful")
}).catch((e)=>{
    console.log(e);
});
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`connected at ${PORT}`);
});

//usually access the localhost

 