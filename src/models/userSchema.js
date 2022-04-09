const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");


// Creating Schema
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        trim : true,
        unique : [true, "Email is already register"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error
            }
        }
    },
    password : {
        type : String,
        trim : true,
        required : true,
        minlength : 5
    },
    confipassword : {
        type : String,
        trim : true,
        required : true,
        minlength : 5,
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    tokens: [{
        token: {
            type : String,
            required : true

        }
    }]
   
});

//Generating token
userSchema.methods.toGenerateToken = async function(){
    try {
        const token = await jwt.sign({_id : this._id.toString()}, process.env.SECRETE_KEY)
        //console.log(token);
        
        this.tokens = this.tokens.concat({token: token})
        await this.save();
        return token;
        
        
    } catch (error) {
        res.send(error)
    }

}


// Hasing password
userSchema.pre("save", async function(next){
    if(this.isModified("password")){

        this.password = await bcrypt.hash(this.password, 10);
        this.confipassword = await bcrypt.hash(this.confipassword, 10);
        
    }
        next();
    
})

userSchema.pre("updateOne", async function(next){
    try {

        if(this._update.password){
    
            this._update.password = await bcrypt.hash(this._update.password , 10);
            this._update.confipassword = await bcrypt.hash(this._update.confipassword, 10)
        }
    
        next();
       
        
    } catch (error) {
        res.send(error)
    }
    
})

const userData = mongoose.model("user" , userSchema);

module.exports = userData;