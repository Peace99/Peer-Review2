const cors = require('cors')
require('dotenv')
require('express-async-errors')
const express = require('express')
const app = new express()

//connect to database
const connectDB = require('./src/database/connectDB')
const { auth, requireEditor} = require('./src/middleware/auth')

//routers
const authRouter = require('./src/routers/auth')
const roleRouter = require("./src/routers/auth");
const reviewerRouter = require('./src/routers/auth')
const articles = require("./src/routers/article")
const reviews = require("./src/routers/reviews")

//error handlers
const notFoundMiddleware = require("./src/middleware/not-found");
const errorHandlerMiddleware = require("./src/middleware/error-handler");

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.get('/', (req, res) => {res.send("peer review")});
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/articles', auth, articles)
app.use('/api/v1/articles/user', auth, articles)
app.use('/api/v1/reviews', auth, reviews)
app.use("/api/v1/profile", authRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/reviewers", reviewerRouter);
app.use('/api/v1/users', authRouter)




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