const express = require("express");
const userData = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const auth = require("../middelware/auth");


const userRoutes = express.Router();



// Register user
userRoutes.post("/register" ,async(req,res) =>{
    try {
        const password = req.body.password;
        const confipassword = req.body.confipassword;

        if(password === confipassword){
            
            const data = new userData(req.body)

            const insertData = await data.save();
            console.log(insertData);
            
            // Token generate..
            const token = await data.toGenerateToken();
            //console.log(`Token is ${token}`);

            // Generating cookie
            res.cookie("jwt",token,{
                expires : new Date(Date.now + 6000),
                httpOnly : true

            })

            res.status(200).send("Your registration success,...");

        }else{
            res.send("Password is not match...")
        }

        
    } catch (error) {
        res.status(400).send(error);
    }
})


// Login user
userRoutes.post("/login",async(req,res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password
        const checkData = await userData.findOne({email: email})
     
        if(checkData){

            //Check password is match or not 
            const isPassMatch = await bcrypt.compare(password,checkData.password)

            if(isPassMatch){

                // generate token
                const token = await checkData.toGenerateToken();
                // console.log(token);
        
                //Cookie generating
                res.cookie("jwt",token,{
                    expires : new Date(Date.now + 3600000), // Token expired in 24 Hours
                    httpOnly : true
                })
                
                res.status(200).send(checkData);
                //console.log(checkData);    
            }else{
                
                res.send("Password is wrong...")
            }
             
        }else{
            res.send("Your email is not register...")

        }
        
    } catch (error) {
        res.status(400).send(error);
    }
})

userRoutes.post("/logout",auth,async(req,res) =>{
    try {
        
        //Logout from single user
        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token != req.token
        })

        res.clearCookie("jwt");

        await req.user.save();
        res.send("Logout successfully...")

        
    } catch (error) {
        res.send(error)
    }
})

userRoutes.put('/changepassword',auth,async(req, res) =>{
    try {
        const checkEmail = await userData.findOne({email : req.body.email})
        const password = req.body.password
        const confipassword = req.body.confipassword
        
        
        if(checkEmail){

            if(password === confipassword){
               const data = await userData.updateOne({_id : checkEmail._id},{$set : {password : password,confipassword : confipassword}})
               //const data = await userData.findOneAndUpdate({password : password},{confipassword : confipassword})
                console.log(data);
                res.send(data)

            }else{
                res.send("Password is not matched.>>>")
            }

        }else{
            res.send("Email is not exist......")

        }



    } catch (error) {
        res.send(error);
    }

    
    
})

module.exports = userRoutes;