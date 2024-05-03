const express = require("express");
require("dotenv").config();
require("express-async-errors");
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const productsRouter = require("./routes/products");
const app = express();

//middlewares
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>Products</a>");
});

const port = process.env.PORT || 5000;

//Error and Not Found middlewares
app.use("/api/v1/products", productsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// server setup
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("Something went wrong: ", error.message);
  }
};
startServer();
