const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('lodash');
const jwt = require('jsonwebtoken');


var {ObjectID} = require('mongodb');
var {mongoose}= require('./db/mongoose');
var {User} = require('./models/users');

var app = express();
const port = process.env.PORT || 100;

app.use(express.static(path.join(__dirname,"images")));
app.use(express.static(path.join(__dirname,"frontEnd")));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req,res)=>{

    res.sendFile(path.join(__dirname+'/frontEnd/intro.html'));
})

app.post('/create-account',(req,res)=>{
    var body=_.pick(req.body,['firstName','lastName','email','phoneNumber','password','securityQuestion','securityAnswer']);
    var user = new User(body)

    user.save().then(()=>
    {   
        res.sendFile(path.join(__dirname+'/frontEnd/userRegistered.html'));
        
    }).catch((e)=>{
        res.status(400).send(e);
    })
})
app.post("/find-account",(req,res)=>{
 
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email: email}).then(function(user)
    {
        if(!user)
        {
          res.status(404).send();
        }
        else{
            if(password!==user.password)
            {
                res.status(400).send()
            }
            else{
                var token = jwt.sign({email:user.email,firstName: user.firstName,lastName: user.lastName,phoneNumber: user.phoneNumber},"dussa");
                if(typeof window!== "undefined")
                {
                    localStorage.token= token;
                }
                res.status(200).send();
            }
        }

    },function(err)
    {
        res.status(400).send(err);
    })
 
})

app.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});