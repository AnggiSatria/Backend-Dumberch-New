const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const router = require("./src/routes");
app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

module.exports = app;
