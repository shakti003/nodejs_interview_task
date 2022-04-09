const mongoose = require("mongoose");

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`).then(()=>{
    console.log("Database connected....");
}).catch((error) =>{
    console.log(error);
});