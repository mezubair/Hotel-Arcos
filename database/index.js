const mongoose = require( "mongoose");

async function ConnectDB(){
    try {
        await mongoose.connect("mongodb+srv://mesamparker1998:00000000@hotelarcos.vthp7iv.mongodb.net/?retryWrites=true&w=majority&appName=hotelArcos");
        console.log("MONGODB connection Successful !! ")
    } catch (error) {
        console.log("MONGO DB ERROR",error);
    }

}

module.exports = ConnectDB;