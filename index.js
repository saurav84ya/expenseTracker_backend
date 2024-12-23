require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser")
const { db } = require("./database/db");
const app = express();

const PORT = process.env.PORT;

//routers import 
const authRouter = require("./routes/auth-router")
const transactions  = require("./routes/transactions")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("hello from mera lund");
});

app.use('/auth' , authRouter)
app.use('/a',transactions)

function server() {
  try {
    db();
    app.listen(PORT);
    console.log("Sevre is running at ", PORT);
  } catch (error) {
    console.log("server starter failed")
  }
}

server();
