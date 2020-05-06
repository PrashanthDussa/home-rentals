const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var {ObjectID} = require('mongodb');
var {mongoose}= require('./db/mongoose');
var {User} = require('./models/users');

var app = express();
const port = process.env.PORT || 100;

app.get("/selectOption.html",(req,res)=>{
    res.send("abc");
})

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
        res.status(400).sendFile(path.join(__dirname+'/frontEnd/userExists.html'));
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
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result===false)
                {
                    res.status(400).send();
                }
                else{
                var token = jwt.sign({email:user.email,firstName: user.firstName,lastName: user.lastName,phoneNumber: user.phoneNumber},"dussa");

                res.status(200).send(token);
              }
            })
            
        }

    },function(err)
    {
        res.status(400).send(err);
    })
 
})

app.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});