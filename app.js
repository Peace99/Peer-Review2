require('dotenv')
require('express-async-errors')
const express = require('express')
const app = new express()

//connect to database
const connectDB = require('./src/database/connectDB')
const user = require('./src/middleware/auth')

//routers
const auth = require('./src/routers/auth')
const articles = require("./src/routers/article")
const reviews = require("./src/routers/reviews")

//error handlers
const notFoundMiddleware = require("./src/middleware/not-found");
const errorHandlerMiddleware = require("./src/middleware/error-handler");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.get('/', (req, res) => {res.send("peer review")});
app.use('/api/v1/auth', auth)
app.use('/api/v1/articles', user, articles)
app.use('/api/v1/reviews', user, reviews)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

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