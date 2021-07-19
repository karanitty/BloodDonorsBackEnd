const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
var app = new express();



app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Model Declarations
const userData = require('./src/model/userData');

app.get('/',(req,res)=>{
    res.send('backend successfull');
});


//User SignUp begins here
app.post('/signup/user',async (req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    }
    var item = userData(newUser);
    await item.save((err,doc)=>{
        if(!err){
            console.log("Success");
            res.send(doc);
        }
        else{
            if(err.code ==11000){
                console.log(err);
                res.status(422).send("Email address already exist");
            }
            else{
                console.log(err);
            }
        }
    });
});
//User SignUp ends here


//Admin & User Login Begins here
app.post('/login/admin',async (req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var user = {
        name:req.body.name,
        password:req.body.password
    }

    if(user.name!='admin'){
        console.log('Failed at name verification');
        res.status(401).send('Invalid Username or Password');
    }
    else{
        if(user.password!='Admin@123'){
            console.log('Failed at password verification');
            res.status(401).send('Invalid Username or Password');
        }
        else{
            let payload = {subject:user.name+user.password};
            let token = jwt.sign(payload,'secretKey');
            let access = 'admin';
            console.log('Success');
            res.status(200).send({token,access});
        }
    }
});

app.post('/login/user', async(req,res)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    console.log(req.body);
    var user = {
        email:req.body.email,
        password:req.body.password
    }

    let userValidate = await userData.findOne({'email':user.email});
    console.log(userValidate);

    if(!userValidate){
        console.log("Failed at email verification");
        res.status(401).send("Invalid Email ID or Password");
    }
    else{
        if(user.password != userValidate.password){
            console.log('Failed at password verification');
            res.status(401).send("Invalid Email ID or Password");
        }
        else{
            let payload = {subject:userValidate.email+userValidate.password};
            let token = jwt.sign(payload,'secretKey');
            let access = userValidate.email;
            console.log('Success');
            res.status(200).send({token,access});
        }
    }
});

//Admin & User Login ends here


//Token Verification
function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject;
    next();
  }

//Port Configuration
app.listen(3000,()=>{
    console.log('Listening at port 3000');
});