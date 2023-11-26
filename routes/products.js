const express= require('express');
const productRouter=express.Router();
const auth=require('../middlewares/auth');
const {Product}=require("../models/products");


productRouter.get("/api/products/",auth, async (req,res)=>{
 try{
    console.log(req.query.category);
    const products=await  Product.find({
        category:req.query.category
    });
    console.log(products);
    res.json(products);
 }
 catch(e){
    console.log(e);
    res.status(500).json({
        error: e.message
    });
 }
});
productRouter.get("/api/products/search/:name",auth, async (req,res)=>{
    try{
       console.log(req.query.category);
       const products=await  Product.find({
          //we need to use regex now so that we can do the search patters.
          name:{$regex: req.params.name, $options:"i"}
       });
       console.log(products);
       res.json(products);
    }
    catch(e){
       console.log(e);
       res.status(500).json({
           error: e.message
       });
    }
   });
productRouter.post("/api/rate-products",auth,async(req,res)=>{
   try{
   const {id,rating}=req.body;
   let product=await Product.findById(id);
   for(let i=0; i<product.ratings.length; i++){
      if(product.ratings[i].userId==req.user){
         product.ratings.splice(i,1);
         break; ///what does splice do? allows to add or delete anything if we have access to index // in this case we are deleting one object.
      }
   }
   const ratingSchema={
      userId: req.user,
      rating,
   };
   product.ratings.push(ratingSchema);
   product=await product.save();
   res.json(product);
   }
   catch(e){
      res.status(500).json({error:e.message});
   }
});
   productRouter.get("/api/deal-the-day",auth,async(req,res)=>{
      try{
       // in this we need to find the product with the highest ratiing how do we do.
       let products=await Product.find({}); //getting all the products.
      products= products.sort((a,b)=>{
         let aSum=0;
         let bSum=0;
         for(let i=0; i<a.ratings.length; i++){
            aSum+=a.ratings[i].rating;
         }
         for(let i=0; i<b.ratings.length; i++){
            bSum+=b.ratings[i].rating;
         }
         if(a.ratings.length==0) aSum=0;
         if(b.ratings.length==0) bSum=0;
         aSum/=a.ratings.length;
         bSum/=b.ratings.length
         return aSum<bSum? 1:-1;
       });
       res.json(products[0]);
      
      }
      catch(e){
         res.status(500).json({error: e.message});
      }
   });

//now we are designing the deal of the day whichever product gets the highest deal will be displayed.


module.exports=productRouter