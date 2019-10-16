const express = require("express");
let students = express.Router();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const uuidv4 = require('uuid/v4');
students.use(cors());


// ########  MIDDLEWARE   ########
const midddleware = require('../config/Middleware');    //Added Middleware
// ###############################

// POST Registration Route (Add Student)
students.post("/", midddleware.checkToken, (req, res) => {
    const studentData = {
        uuid: "",
        ins_uuid: req.decoded.id,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        img: "https://icon-library.net/images/default-profile-icon/default-profile-icon-24.jpg",
        username: req.body.username,
        password: req.body.password,
    }

    Student.findOne({
        where: {
            email: req.body.email,
            ins_uuid: studentData.ins_uuid
        }
    })
    .then(student => {
        if(!student){
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                studentData.password = hash;
                studentData.uuid = uuidv4();
                Student.create(studentData)
                .then(student => {
                    res.status(200).json({
                        status: "Student Successfully Added."
                    });
                })
                .catch(err => {
                    res.send(err);
                });
            });
        } else {
            res.status(400).json({
                error: "Student Already added to the database"
            });
        }
    })
    .catch(err => {
        res.send(err);
    })
})

// GET ALL Students
students.get("/", midddleware.checkToken, (req, res) => {
    Student.findAll({
        where: {
            ins_uuid: req.decoded.id
        },
        attributes: ['uuid', 'fname', 'lname' , 'email', 'phone', 'img']
    })
    .then(student => {
        res.status(200).json({status: "OK", student})
    })
    .catch(err => {
        res.send(err);
    })
})

// GET Route to retrieve a single student <findOne>
students.get("/:id", midddleware.checkToken, (req, res) => {
    Student.findOne({
        where: {
            ins_uuid:req.decoded.id,
            uuid: req.params.id
        },
        attributes: ['uuid', 'fname', 'lname' , 'email', 'phone', 'address', 'img']
    })
    .then(student => {
        res.status(200).json({status: "Ok", student})
    })
    .catch(err => {
        res.send(err);
    })
})

// POST Login Route 
students.post('/login', (req, res) => {
    Student.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(student => {
        if (student) {
            if(bcrypt.compareSync(req.body.password, student.password)){
                let token = jwt.sign({id: student.uuid, isAdmin: false, isStaff: false, isStudent: true}, process.env.APP_SECRET, {
                    expiresIn: 1440
                })
                res.send({token});
            } else{
                res.status(403).json({error: 'Wrong Credentials'})
            }
        }else{
            res.status(400).json({error: 'Student doesn\'t exist'})
        }
    })
    .catch(err => {
        res.status(400).json(err);
        console.log(errr);
    })
})
module.exports = students;