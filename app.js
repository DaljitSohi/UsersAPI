const express = require('express');
var app = express();

const cors = require('cors');
app.use(cors());

const bcrypt = require('bcrypt');
const saltRounds = 10;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //Middleware to parse POST Requests

//http Server
var http = require('http');

//Pipe all server request through 'morgan'
const morgan = require('morgan');
app.use(morgan('dev'));

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const connection = new Sequelize('postgres://daljit_test:testPass@localhost:5432/HealthAppUsers'); //Connecting to Postgres DataBase

//Model for "Physician" Table
const Physician = connection.define('Physician', {
  physicianID:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  birthDate: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  primaryNo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  secondaryNo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  sex: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
{
    timestamps: false,
    hooks: {
      afterValidate: function (user) {
        //After validating the User. Generate a salt, and Hash the password, and then store to the database.
        user.password = bcrypt.hashSync(user.password, 10);
      }
    }
});

//Model for the "Patients" Table
const Users = connection.define('Patient', {
  patientID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  birthDate: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  primaryNo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  secondaryNo: {
    type: Sequelize.STRING,
    allowNull: true
  },
  sex: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  physicianID:{
    type: Sequelize.INTEGER,
    references: {
      model: 'Physicians',
      key: 'physicianID'
    },
    allowNull: true
  }
},
{
    timestamps: false,
    hooks: {
      afterValidate: function (user) {
        //After validating the User. Generate a salt, and Hash the password, and then store to the database.
        user.password = bcrypt.hashSync(user.password, 10);
      }
    }
});


//Testing Connection to the Database
connection.authenticate().then(function () {
  console.log('Connection has been established succesfully');
}).catch(function (error) {
  console.error('Unable to connect to the database:', error);
});
//Created a Patienet and a Physician for Test Purposes
connection.sync({
  // force: true,
  logging: console.log()
}).then(function () {
/**
  Users.create({
    firstName: "John",
    lastName: "Doe",
    birthDate: "1990/05/23",
    email: "john_doe@email.com",
    primaryNo: "4165555555",
    secondaryNo: "9055555555",
    sex: "Male",
    address: "742 Evergreen Terrace, Toronto, ON,  Canada",
    username: "johnDoe",
    password: "johnpass",
    physicianID: 1
  });

  Users.create({
    firstName: "Homer",
    lastName: "Simpsons",
    birthDate: "1979/05/12",
    email: "homerSimpsons@email.com",
    primaryNo: "4165555555",
    secondaryNo: "9051231234",
    sex: "Male",
    address: "742 Evergreen Terrace, Toronto, ON, Canada",
    username: "HomerSimpsons",
    password: "homerpass",
    physicianID: 1
  });

  Users.create({
    firstName: "Lisa",
    lastName: "Simpsons",
    birthDate: "2009/05/11",
    email: "lisaSimpsons@email.com",
    primaryNo: "9051231324",
    secondaryNo: null,
    sex: "Female",
    address: "742 Evergreen Terrace, Toronto, ON, Canada",
    username: "LisaSimpsons",
    password: "lisapass",
    physicianID: 1
  });

  Users.create({
    firstName: "Bruce",
    lastName: "Wayne",
    birthDate: "1986/06/28",
    email: "brueWayne@wayneenterprises.com",
    primaryNo: "4165555555",
    secondaryNo: null,
    sex: "Male",
    address: "100 DC Universe Street, Burkbank, CA, USA",
    username: "bruceWayne",
    password: "batman",
    physicianID: 2
  });

  Users.create({
    firstName: "Harvet",
    lastName: "Dent",
    birthDate: "1980/12/31",
    email: "harvey@email.com",
    primaryNo: "6477899874",
    secondaryNo: null,
    sex: "Male",
    address: "305 DC Universe Street, Burkbank, CA, USA",
    username: "HarveyDent ",
    password: "twoface",
    physicianID: 2
  });
*/

  Physician.create({
    firstName: "Hugo",
    lastName: "Strange",
    birthDate: "1970/09/18",
    email: "hugo_strange@example.com",
    primaryNo: "6471231234",
    secondaryNo: "905123456",
    sex:"Male",
    address:"200 DC Universe Street, Burkbank, CA, USA",
    username: "hugoStrange",
    password: "docstrange",
  });

  Physician.create({
    firstName: "Jane",
    lastName: "Doe",
    birthDate: "1970/05/12",
    email: "jane_doe@example.com",
    primaryNo: "6471231234",
    secondaryNo: "905123456",
    sex: "Female",
    address: "8100 localhost Street, Toronto, ON,  Canada",
    username: "janeDoe",
    password: "janepass"
  });
});

//All the Routes
app.get('/', function (req, res) {
  res.send("Wireless Health Monitor");
});

//Return all the users in the DataBase
app.get('/api/users/', function (req, res) {
  //Query all the users in the database, and send them to the parameter -> all_users
  Users.findAll().then(function (all_users) {
    //print all the user in the database, as a JSON text.
    res.statusCode = 200;
    res.send(all_users);
  });
});


//Return a single users in the DataBase: using the "ID"
app.get('/api/user/:id', function (req, res) {
  const userID = req.params.id; //get the user 'id'

  //Query the User Database, and find the
  Users.findById(userID).then(function (userData) {
    if (userData == null) {
      res.send('User does not exist');
    } else {
      res.statusCode = 200;
      res.send(userData);
    }
  });
}); //end GET


//Return User Data: given the "username"
app.get('/api/user/:username', function (req, res) {
  const userName = req.params.username; //get the username
  let userData = {}; //JSON object.

  Users.findOne({
    where: {
      username: userName
    }
  }).then(function (data) {
    if (data == null) {
      res.statusCode = 404;
      res.send('Requested user does not exist');
    } else {
      userData = {
        "firstName": data.firstName,
        "lastName": data.lastName,
        "id": data.patientID
      }
      res.statusCode = 200;
      res.send(userData);
    }
  });
}); //end GET UserData given 'Username'


//Adding new Users to the DataBase
app.post('/api/user', function (req, res) {
  var newUser = req.body;
  console.log('Creaing User Data: ' + newUser.username);

  //Search the database to make sure, the user doesn't already exists
  Users.findAll({
    where: {
      username: newUser.username
    }
  }).then(function (userData) {
    if (userData.length == 0) {
      //Open a new connection to the Database
      connection.sync({
        //sync flags
        logging: console.log
      }).then(function () {
        //create a new User
        Users.create({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          birthDate: newUser.birthDate,
          email: newUser.email,
          primaryNo: newUser.primaryNo,
          secondaryNo: newUser.secondaryNo,
          emergencyNo: newUser.emergencyNo,
          sex: newUser.sex,
          address: newUser.address,
          username: newUser.username,
          password: newUser.password,
          accountType: newUser.accountType
        });
        //Send when the new user has been created.
        res.statusCode = 201;
        res.send('User "' + newUser.username + '" created');
      });
    } else {
      res.statusCode = 409;
      res.send('User "' + newUser.username + '" already exists');
    } //end else
  });
}); //end POST


//Update a user using the "ID"
app.put('/api/user/:id', function (req, res) {
  const userID = req.params.id; //get used ID
  const updatedData = req.body; //get the request 'body'

  Users.findById(userID).then(function (userData) {
    if (userData == null) {
      res.statusCode = 404;
      res.send('Requested user does not exist');
    } else {
      //Update Query
      Users.update({
        //New data to be inserted
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        birthDate: updatedData.birthDate,
        primaryNo: updatedData.primaryNo,
        secondaryNo: updatedData.secondaryNo,
        emergencyNo: updatedData.emergencyNo,
        sex: updatedData.sex,
        address: updatedData.address,
        username: updatedData.username,
        password: updatedData.password,
        accountType: updatedData.accountType,
        physicianID: updatedData.physicianID
      },
        {
          where: {
            //update using the UserID
            patientID: {
              [Op.eq]: userID
            }
          }
        }); //end update()
      res.statusCode = 200;
      res.send("User updated");
    } //end if/else
  }); //end findByID()
});//end app.put


// Authenticating User Login
app.post('/authenticate', function (req, res) {
  var authUser = req.body;
  console.log('Authenticating User: ' + authUser.username);

  //Check if the Usernames exists in the database
  Users.findOne({
    where: {
      username: authUser.username
    }
  }).then(function (userData) {
    if (userData == null) {
      res.statusCode = 404;
      res.send("Incorrect Username or Password");
    } else {
      //Compare the passwords sent by the user, to the one that exist in the DataBase
      var comparePass = bcrypt.compareSync(authUser.password, userData.password);
      if (!comparePass) {
        res.statusCode = 404;
        res.send("Incorrect Username or Password");
      } else {
        res.statusCode = 200;
        res.send("User Authenticated");
      }
    }
  });// end findOne User
});


//Delete a user from the database, using the "ID"
app.delete('/api/user/:id', function (req, res) {
  const userID = req.params.id;

  //Find if the user exits in the database
  Users.findById(userID).then(function (userData) {
    if (userData == null) {
      //send a message if the user doesn't exist in the database.
      res.statusCode = 404;
      res.send('User does not exist');
    } else {
      //delete the user if it does exit.
      Users.destroy({
        where: {
          id: userID
        }
      });
      res.statusCode = 200;
      res.send("Deleted: " + userData.username);
    }
  });
});


// ******** Routes to Access Physician Data *********** //

//Return Physican data, given the username
app.get('/api/users/physician/:username', function(req, res){
  const userName = req.params.username;

  let physicianData = {}; //JSON object.

  Physician.findOne({
    where: {
      username: userName
    }
  }).then(function (data) {
    if (data == null) {
      res.statusCode = 404;
      res.send('Requested physican does not exist');
    } else {
      physicianData = {
        "firstName": data.firstName,
        "lastName": data.lastName,
        "physicanID": data.physicianID
      }
      res.statusCode = 200;
      res.send(physicianData);
    }
  });
});

//Authenticate Physician
app.post('/authenticate/physician', function (req, res) {
  var authUser = req.body;
  console.log('Authenticating User: ' + authUser.username);

  //Check if the Usernames exists in the Physician Table
  Physician.findOne({
    where: {
      username: authUser.username
    }
  }).then(function (userData) {
    if (userData == null) {
      res.statusCode = 404;
      res.send("Incorrect Username or Password");
    } else {
      //Compare the passwords sent by the user, to the one that exist in the DataBase
      var comparePass = bcrypt.compareSync(authUser.password, userData.password);
      if (!comparePass) {
        res.statusCode = 404;
        res.send("Incorrect Username or Password");
      } else {
        res.statusCode = 200;
        res.send("User Authenticated");
      }
    }
  });// end findOne Physician
});

//Return all the users in the Physician Table
app.get('/api/users/physician', function (req, res) {
  //Query all the users in the database, and send them to the parameter -> all_users
  Physician.findAll().then(function (all_users) {
    //print all the user in the database, as a JSON text.
    res.statusCode = 200;
    res.send(all_users);
  });
});

//Get all patients, linked to give Physican ID
app.get('/api/users/physician/patients/:id', function(req, res){
  const physician_ID = req.params.id;

  let patients = []; //Array
  let pData = {};//JSON object
  Users.findAll({
    where: {
      physicianID: physician_ID
    }
  }).then(function(patients_data){
    if (patients_data == null) {
      res.statusCode = 404; //Not Found
      res.send('Requested physican does not exist');
    } else {
      res.statusCode = 200; //OK

      for(var i = 0; i < patients_data.length; i++){
        pData = {
          "patientID": patients_data[i].patientID,
          "firstName": patients_data[i].firstName,
          "lastName": patients_data[i].lastName
        }
        patients.push(pData);
      }
      // patients.push(pData);
      res.send(patients);
    }
  });

});

//Return error 404.
app.get('/*', function (req, res) {
  res.send("Error 404 Method Not Allowed!");
});

//app is listening on port 3001. Address -> localhost:3001
var port = process.env.PORT || 3001;
app.listen(port);
console.log('Now listening on port 3001...........');

// http.createServer(app).listen(3001, '10.190.38.156');
