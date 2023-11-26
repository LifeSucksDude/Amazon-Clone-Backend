//IMORT from packages
const express = require("express");
const User = require("../models/user");
const brcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt=require("jsonwebtoken");
const auth = require("../middlewares/auth");

authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .statusCode(400)
        .json({ msg: "User with same email already exists" });
    }
    const hashPassword = await brcryptjs.hash(password, 8);
    //get the data from the client
    //then post the data in the database
    //return the data to the user.
    let user = new User({
      email,
      password: hashPassword,
      name,
    });
    user = await user.save(); //using mongoDb to save it.
    res.json(user);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
  //signinroute
});
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email doesn't exist!" });
    }
    //test123
    //gibberish
    //how to compare both of them how do we compare
   const isMatch= brcryptjs.compare(password,user.password);
   if(!isMatch){
    return res.status(400)
   }
   const token=jwt.sign({id:user._id},"passwordKey");
   res.json({token,...user._doc});
  //  {
  //   "token": token,
  //   user json file , it just adds the token to the user json file
  //  }
   

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
authRouter.post("/tokenIsValid",async(req,res)=>{
 try{
  const token=req.header('x-auth-token');
 
  if(!token) return res.json(false);
  const verified= jwt.verify(token,"passwordKey");
  if(!verified) return res.json(false);
  const user=await User.findById(verified.id);
  if(!user) return res.json(false);
  res.json(true);

 }
 catch(e){
  res.status(500).json({ error: e.message });
 }
});
//get user data
authRouter.get('/',auth,async(req,res)=>{
 const user = await User.findById(req.user);
 res.json({...user._doc, token: req.token});
});

module.exports = authRouter; //no longer a private variable
