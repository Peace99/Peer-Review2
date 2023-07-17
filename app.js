require('dotenv')
require('express-async-errors')

//connect to database
const connectDB = require('./src/database/connectDB')
const user = require('./src/middleware/auth')

//routers
const authRouther = require("./src/routers/auth")
const articles = require("./src/routers/article")

//error handlers
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

const port = process.env.PORT || 3000

const start = async () => {
  console.log("running");
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();