const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const url = `mongodb://localhost:27017/blooddonationrgipt`;

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useNewUrlParser:true,
      // useCreateIndex:true,
      // useFindAndModify:false
    });
    if(connection) {
      console.log("Database Connected!!");
    }
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
};


connectDatabase();