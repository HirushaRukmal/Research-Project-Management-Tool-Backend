/*
    Created by - Isuru Pathum Herath
    On - 22/04/2022
    Description - Student Registration
 */

const Student = require('../models/Student');
const nodemailer = require("nodemailer");
const Group = require('../models/Group');
require('dotenv').config();

/*
Name - Create Student Account
Date - 22/04/2022
 */
exports.create = (req, res) => {

    const { fullName, sliitId, sliitEmail, personalEmail, contactNo, studentType, groupStatus } = req.body

    // Validate Email & Phone Number /^\d*(?:\.\d{1,2})?$/
    var validator = require("email-validator");

    if ((validator.validate(sliitEmail) && (validator.validate(personalEmail)))) {


        //Generate Random Passwords
        var generator = require('generate-password');
        var password = generator.generate({
            length: 10,
            numbers: true
        });

        console.log(`Username: ${sliitEmail}`);
        console.log(`Password: ${password}`);

        //Check Empty Parameters
        switch (true) {
            case !fullName:
                return res.status(400).json({
                    error: 'Full Name is required'
                });
            case !sliitId:
                return res.status(400).json({
                    error: 'SLIIT Student ID is required'
                });
            case !sliitEmail:
                return res.status(400).json({
                    error: 'SLIIT Student Email Address is required'
                });
            case !personalEmail:
                return res.status(400).json({
                    error: 'Personal Email Address is required'
                });
            case !contactNo:
                return res.status(400).json({
                    error: 'Contact Number is required'
                });
            case !studentType:
                return res.status(400).json({
                    error: 'Student Type is required'
                });
        }

        //Check Server Errors
        Student.create({ fullName, sliitId, sliitEmail, personalEmail, contactNo, studentType, groupStatus, password }, (err, student) => {

            //Check Server Errors
            if (err) {
                console.log(err)
                if (err.keyPattern.sliitId == 1) {
                    res.status(400).json({
                        error: 'SLIIT ID is already registered!'
                    });
                }
                else if (err.keyPattern.sliitEmail == 1) {
                    res.status(400).json({
                        error: 'SLIIT Email is already registered!'
                    });
                }
                else if (err.keyPattern.contactNo == 1) {
                    res.status(400).json({
                        error: 'Contact Number is already registered!'
                    });
                }
                else if (err.keyPattern.personalEmail == 1) {
                    res.status(400).json({
                        error: 'Personal Email Address is already registered! Try Again!'
                    });
                }
                else {
                    res.status(400).json({
                        error: 'Internal Server Error! Try Again!'
                    });
                }

            }
            else {
                res.json(student);

                const nodemailer = require("nodemailer");

                async function main() {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.MAIL_SERVER_USERNAME,
                            pass: process.env.MAIL_SERVER_PASSWORD
                        }
                    });

                    var mailOptions = {
                        from: 'researchprojectsliit@gmail.com',
                        to: `${sliitEmail}, ${personalEmail}`,
                        subject: 'Student Registration - Login Details',
                        text:
                            `Hi,
                        
Student Resigration is successful. 

You can login to the system using these username and password. This is a temporary login.
                            
You have to give new username and password in your first login
                            
Username: ${sliitEmail}
Password: ${password}
                            
This is an auto generated email. If you have any issue with login to the system feel free to contact the support center 0761714844
                            
Thank You`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                }

                main().catch(console.error);
            }

        });




    } else {
        console.log("Invalid Email Address")
        res.status(400).json({
            error: 'Invalid Email Address!'
        })
    }
};

/*
Name - Display All Students
Date - 23/05/2022
*/

exports.getAllStudents = (req, res) => {
    Student.find({})
        // .limit(10)
        .sort({ createdAt: -1 })
        .exec((err, student) => {
            if (err)
                console.log(err);
            else
                res.json(student);
        });
};

/*
Name - Display Student by ID
Date - 23/05/2022
 */
exports.getById = (req, res) => {
    const { id } = req.params
    console.log(id)
    Student.findById({ _id: id })
        .exec((err, student) => {
            if (err)
                console.log(err);
            else
                res.json(student);
        });
};

/*
Name - Display Student by ID
Date - 02/06/2022
 */
exports.getByIdInternalCall = (id) => {
    console.log(id)
    Student.findById({ _id: id })
        .exec((err, student) => {
            if (err)
                return err;
            else {
                console.log(student)
                return student;
            }

        });
};

/*
Name - Get Student by Username and Password
Date - 23/05/2022
 */
exports.getByUsernameAndPassword = (req, res) => {
    const { sliitEmail, password } = req.body
    console.log(req.body)
    Student.findOne({ sliitEmail: sliitEmail, password: password })
        .exec((err, student) => {
            if (err) {
                console.log(err);
                res.status(400).json({
                    error: 'Unautherized'
                });
            }
            else {
                res.json(student);
                console.log(student);
            }

        });
};

/*
Name - Update Student Details
Date - 23/05/2022
 */
exports.update = (req, res) => {
    const { id } = req.params;
    const { fullName, sliitId, sliitEmail, personalEmail, contactNo, studentType, groupStatus } = req.body;
    Student.findOneAndUpdate({ _id: id }, { fullName, sliitId, sliitEmail, personalEmail, contactNo, studentType, groupStatus }, { new: true }).exec((err, student) => {
        if (err)
            console.log(err);
        else
            res.json(student);
    })
};

/*
Name - Delete Student by ID
Date - 23/05/2022
 */
exports.deleteById = (req, res) => {
    const { id } = req.params
    console.log(id)
    Student.findByIdAndDelete({ _id: id })
        .exec((err, student) => {
            if (err)
                console.log(err);
            else
                res.json(student);
        });
};