require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
require("./db/connet");
const userRoutes = require("./routers/userRoutes");

const app = express();
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(userRoutes);


app.get("/",(req,res) =>{
    res.send("Hello from express side....");
});


app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});