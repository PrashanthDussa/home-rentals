const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('client-sessions');
const hbs = require('hbs');

var {ObjectID} = require('mongodb');
var {mongoose}= require('./db/mongoose');
var {User} = require('./models/users');

var app = express();
const port = process.env.PORT || 100;

app.set("view engine","hbs");

app.use(express.static(path.join(__dirname,"public")));


app.use(session({
    cookieName:"session",
    secret:"dussa",
    duration:30 * 60 * 1000,
    activeDuration:5 * 60 * 1000
}))


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));


app.get('/',(req,res)=>{

    res.sendFile(path.join(__dirname+'/public/intro.html'));
})

app.post('/create-account',(req,res)=>{
    var body=_.pick(req.body,['firstName','lastName','email','phoneNumber','password','securityQuestion','securityAnswer']);
    var user = new User(body)
   
    user.save().then(()=>
    {   
        res.sendFile(path.join(__dirname+'/public/userRegistered.html'));
        
    }).catch((e)=>{
        res.status(400).sendFile(path.join(__dirname+'/public/userExists.html'));
    })
})
app.post("/find-account",(req,res)=>{
 
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({email: email}).then(function(user)
    {
        if(!user)
        {
            res.status(404).sendFile(path.join(__dirname+'/public/noUser.html'));
        }
        else{
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result===false)
                {
                    res.status(400).sendFile(path.join(__dirname+'/public/invalidPassword.html'));
                }
                else{
                // var token = jwt.sign({email:user.email,firstName: user.firstName,lastName: user.lastName,phoneNumber: user.phoneNumber},"dussa");
                req.session.user = user;
                res.redirect("/selectOption");
              }
            })
            
        }

    },function(err)
    {
        res.status(400).send(err);
    })
 
})

app.get("/selectOption",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
            {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
             }
            else{
                 res.render("selectOption.hbs");           
             }
        })
    }
    else{
     res.sendFile(path.join(__dirname+'/public/login.html'));
 
       }
 })

 app.get("/logout",(req,res)=>{
     req.session.reset();
     res.redirect("/login.html");
 })

 app.get("/myAccount",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
            {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
             }
            else{
                 res.render("Account.hbs",{
                     email: user.email,
                     firstName:user.firstName,
                     lastName:user.lastName,
                     phoneNumber:user.phoneNumber
                 });         
             }
        })
    }
    else{
     res.sendFile(path.join(__dirname+'/public/login.html'));
 
       }
 })



app.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});