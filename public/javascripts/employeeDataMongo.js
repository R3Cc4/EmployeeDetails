var mongoose = require('mongoose');
//var moment = require('moment-timezone');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
    "First Name": String,
    "Last Name": String,
    "Manager Name": String,
    "Date Of Joining": {
        type: Date,
        default: Date.now
    }

});

var Employee = mongoose.model('employee', employeeSchema, 'employees');

/*Fetch Employee Details from mongoDB*/
exports.getEmployeeDetails = function (callback) {

    var command1 = {
        aggregate: 'employees',
        pipeline: [
            {
                $project: {
                    'First Name': 1,
                    'Last Name': 1,
                    'Manager Name': 1,
                    'Date Of Joining': 1,
                    'Work Experience': 1
                }
            }
        ]
    };


    mongoose.connection.db.command(command1, callback);
}

/*Delete Employee Details from mongoDB*/
exports.deleteEmployeeDetails = function (idsToDelete, callback) {
    var objectids = [];
    console.log("before ObjectIds" + typeof idsToDelete);
    idsToDelete = idsToDelete.replace(/\[|\]/g, "")
    idsToDelete = idsToDelete.split(",");
    console.log(idsToDelete);

    console.log("Validation before for loop ==" + mongoose.Types.ObjectId.isValid("57298b4b406c5c4a4bcfc34d"));
    for (var i = 0; i < idsToDelete.length; i++) {

        console.log(idsToDelete[i].toString());
        console.log("Is id valid?? == " + mongoose.Types.ObjectId.isValid("57298b4b406c5c4a4bcfc34d"));
        objectids.push(mongoose.Types.ObjectId("57298b4b406c5c4a4bcfc34d"));
    }
    console.log("After ObjectIds");
    console.log("Ids in mongoose ==" + objectids);
    Employee.find({
        _id: {
            $in: objectids
        }
    }, function (err, res) {
        console.log("err =" + err);
        console.log(res);
    });
    //mongoose.connection.db.command(command2, callback);
}