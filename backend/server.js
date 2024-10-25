require("dotenv").config()
const { log } = console
const express = require('express');
const app   = express();
const port = process.env.PORT || 4000
const server = app.listen(port, ()=> log("chat server launched at port " + port) );

app.use(express.static(path.join(__dirname, "public",)))