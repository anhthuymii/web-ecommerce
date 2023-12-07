import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });

const connectDB = async () => {
  try {
    console.log("MONGO_URL:", process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });
    console.log(
      `Connected To Mongodb Database ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in Mongodb ${error}`.bgRed.white);
  }
};

export default connectDB;
