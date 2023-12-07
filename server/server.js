import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import cors from "cors";
import paymentStripe from "./routes/payment.js";
import orderRoutes from "./routes/orderRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import searchRoutes from "./routes/searchRoute.js";
import es from "./config/es.js";
import reviewRoutes from "./routes/reviewRoute.js";
dotenv.config();
//database config
connectDB();

//rest object
const app = express();
app.set("view enginer", "ejs");

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use(bodyParser.json());
app.post(
  "/webhook",
  express.json({ verify: (req, res, buf) => (req.body = buf.toString()) })
);
//routes
app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product/", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/payment", paymentStripe);
app.use(
  "/api/stripe",
  paymentStripe,
  express.json({ verify: (req, res, buf) => (req.body = buf.toString()) })
);

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the ecommerce website Jeano project</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
