const express = require("express");
let classrooms = express.Router();
const cors = require("cors");
const Classroom = require("../models/classroom"); //Classroom Model
const Staff = require("../models/staff"); // Staffs Model
const Student = require("../models/student"); // Student Model
const ClassStaff = require("../models/class_staff"); // Classroom and Staff Model
const ClassStud = require("../models/class_std"); // Classroom and Student Model
const Assignment  = require("../models/assignment"); // Assignment Model
const db = require('../config/config');

const uuidv4 = require('uuid/v4');
classrooms.use(cors());

// ########  MIDDLEWARE   ########
const middleware = require('../config/Middleware');    //Added Middleware
// ###############################

Classroom.belongsToMany(Student, {through: ClassStud, foreignKey: 'classID'})
Student.belongsToMany(Classroom, {through: ClassStud, foreignKey: 'studID'})
Classroom.belongsToMany(Staff, {through: ClassStaff, foreignKey: 'classID'})
Staff.belongsToMany(Classroom, {through: ClassStaff, foreignKey: 'staffID'})
// Classroom.belongsToMany(Assignment, {through: ClassStaff, foreignKey: 'staffID'})

Assignment.belongsTo(Classroom)
Assignment.belongsTo(Staff)

// POST Route 
classrooms.post("/", middleware.checkToken, (req, res) => {
    const classData = {
        ID: "",
        ins_uuid: req.decoded.id,
        name: req.body.name
    }

    classData.class_uuid = uuidv4();
    Classroom.create(classData)
    .then(classroom => {
        res.status(200).json({
            status: "Classroom Successfully Created."
        });
    })
    .catch(err => {
        res.send(err);
    })
})

// GET Route
classrooms.get("/", middleware.checkToken, (req, res) => {
    Classroom.findAll({
        where: {
            ins_uuid: req.decoded.id
        },
        attributes: ['classID', 'name', 'createdAt','img'],
        include: [ 
            {
                model: Student ,
                // where: {
                //     ins_uuid: req.decoded.id
                // },
                
                attributes: ['studID','fname', 'lname', 'img'],
                through: { attributes: [] }              
            },
            {
                model: Staff,
                // where: {
                //     ins_uuid: req.decoded.id
                // },
                
                attributes: ['staffID', 'fname', 'lname', 'img'],
                through: { attributes: []}
            }              
        ]
    })
    .then(classroom => {
        res.status(200).json({status: "OK", classroom})
    })
    .catch(err => {
        res.send(err);
    })
})

classrooms.post('/assignment', (req, res) =>{
    
    db.sequelize.query(`SELECT assignment.id, assignment.assign_name AS name, assignment.assign_details AS details, assignment.assign_date AS assignedAt, CONCAT(staff.staff_fName, " ", staff.staff_lname) AS staff_name FROM tbl_assignment assignment LEFT JOIN tbl_classroom class on class.class_uuid = assignment.class_uuid LEFT JOIN tbl_staff staff on staff.staff_uuid = assignment.staff_uuid WHERE class.class_uuid = "${req.body.id}"`,{ type: db.sequelize.QueryTypes.SELECT })
    .then(results => {
        res.json(results);
     })
    .catch( err => {
        res.send(err)
    });
})

// GET Route to retrieve a single classroom <findOne>
classrooms.get("/:id", middleware.checkToken, (req, res) => {
    Classroom.findOne({
        where: {
            ins_uuid: req.decoded.id,
            class_uuid: req.params.id
        },
        attributes: ['classID', 'name', 'createdAt', 'img'],
        include: [ 
            {
                model: Student ,
                // where: {
                //     ins_uuid: req.decoded.id
                // },
                attributes: ['studID','fname', 'lname', 'img'],
                through: { attributes: [] }              
            },
            {
                model: Staff,
                // where: {
                //     ins_uuid: req.decoded.id
                // },
                attributes: ['staffID', 'fname', 'lname', 'img'],
                through: { attributes: []}
            }

        ]
    })
    .then(classroom => {
        res.status(200).json({status: "Ok", classroom})
    })
    .catch(err => {
        res.send(err);
    })
})

// PUT Route <update>
classrooms.put('/:id', middleware.checkToken, (req, res) => {
    var classData = {
        name: req.body.name
    }

    Classroom.update(ClassData, {
        where: {
            classData: req.params.id
        }
    })
    .then(classroom => {
        res.status(200).json({classroom})
    })
    .catch(err => {
        res.send(err);
    })
})

// DELETE Route <drop>
classrooms.delete('/:id', middleware.checkToken, (req, res) => {
    Classroom.destroy({
        where: {
            class_uuid : req.params.id, 
            ins_uuid: req.decoded.id
        }
    })
    .then(classroom => {
        res.status(200).json({status: "Ok"})
    })
    .catch(err => {
        res.send(err);
    })
})

// GET Route for student
classrooms.get('/student', middleware.checkToken, (req, res) => {
    Classroom.findAll({
        where: {
            ins_uuid: req.decoded.id
        },
       attributes: {exclude: ['id','ins_uuid','createdAt']},
        include: [ 
            {
                model: Student ,
                where: {
                    ins_uuid: req.decoded.id
                },
                attributes: ['studID','fname', 'lname', 'username', 'img'],
                through: { attributes: [] }              
            } 
        ],
        
    }).then(classroom => {
        res.status(200).json({status: "OK", classroom})
    })
    .catch( err => {
        res.send(err)
    });
})

// GET Route for staff
classrooms.get('/staff',middleware.checkToken, (req, res) =>{
    
    Classroom.findAll({
        where: {
            ins_uuid: req.decoded.id
        },
        attributes: {
            exclude: ['id', 'ins_uuid', 'createdAt'] 
        },
        include: [
            {
                model: Staff,
                where: {
                    ins_uuid: req.decoded.id
                },
                attributes: ['staffID', 'fname', 'lname', 'img'],
                through: { attributes: []}
            }
        ]
    }).then(classroom => {
        res.status(200).json({status: "OK", classroom})
    })
    .catch( err => {
        res.send(err)
    });
})
module.exports = classrooms;