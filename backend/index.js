// express, cors, body-parser, jwt, mysql, bcrypt, @hapi/joi, sequelize, nodemon,
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// making route for institute
var Institutes = require("./routes/Institutes");
app.use("/institutes", Institutes);

// making route for staff
var Staffs = require("./routes/Staffs");
app.use("/staffs", Staffs);

// making route for student
var Students = require("./routes/Students");
app.use("/students", Students);

// making route for classroom
var Classrooms = require("./routes/Classrooms");
app.use("/classrooms", Classrooms);

app.listen(3000, console.log('Server started at port 3000'));
