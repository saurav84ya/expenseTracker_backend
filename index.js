require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { db } = require("./database/db");
const app = express();


const PORT = process.env.PORT;

// Routers import
const authRouter = require("./routes/auth-router");
const transactions = require("./routes/transactions");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from mera lund");
});

app.use("/auth", authRouter);
app.use("/a", transactions);

async function server() {
  try {
    await db(); // Ensure database connection is awaited
    console.log("Connected to Redis");

    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:");
  }
}

server();
