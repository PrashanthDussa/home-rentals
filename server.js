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

 app.get("/tenant",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
            {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
             }
            else{
                 res.render("Tenant.hbs");           
             }
        })
    }
    else{
     res.sendFile(path.join(__dirname+'/public/login.html'));
 
       }
 })

 app.get("/owner",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
            {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
             }
            else{
                 res.render("Owner.hbs");           
             }
        })
    }
    else{
     res.sendFile(path.join(__dirname+'/public/login.html'));
 
       }
 })

 app.post("/saveAddress",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
               {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
                }
            else{
                  if(user.ownerInfo[0])
                  {
                    res.sendFile(path.join(__dirname+'/public/addressFound.html'));
                }
                  else{

                    var state = req.body.state;
                    var district = req.body.district;
                    var town = req.body.town;
                    var area = req.body.area;
                    var address = req.body.address;
                    var houseDescription = req.body.houseDescription;
                    var contactNumber = req.body.contactNumber;
                    var veg,shop,milk,grocery,hospital,cinema,bus,rail;
                    if(req.body.veg==='on')
                    {
                        veg = "present";
                    }
                    else{
                        veg="absent";
                    }
                    if(req.body.shop==='on')
                    {
                        shop = "present";
                    }
                    else{
                        shop="absent";
                    }
                    if(req.body.milk==='on')
                    {
                        milk = "present";
                    }
                    else{
                        milk="absent";
                    }
                    if(req.body.grocery==='on')
                    {
                        grocery = "present";
                    }
                    else{
                        grocery="absent";
                    }
                    if(req.body.hospital==='on')
                    {
                        hospital = "present";
                    }
                    else{
                        hospital="absent";
                    }
                    if(req.body.cinema==='on')
                    {
                        cinema = "present";
                    }
                    else{
                        cinema="absent";
                    }
                    if(req.body.bus==='on')
                    {
                        bus = "present";
                    }
                    else{
                        bus="absent";
                    }
                    if(req.body.rail==='on')
                    {
                        rail = "present";
                    }
                    else{
                        rail="absent";
                    }
                    user.ownerInfo.push({state,district,town,area,address,houseDescription,contactNumber,veg,shop,milk,grocery,hospital,cinema,bus,rail});
                    user.save().then(()=>{
                      res.sendFile(path.join(__dirname+'/public/addressRegistered.html'));
                    })
                  }
               
            }
        })
    }
    else{
     res.sendFile(path.join(__dirname+'/public/login.html'));
 
       }
 })

 app.get("/getAddress",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
            {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
             }
            else{
                    if(!user.ownerInfo[0])
                    {
                        res.sendFile(path.join(__dirname+'/public/noAddress.html'));
                    }
                    else{
                        res.render("address.hbs",{
                            state:user.ownerInfo[0].state,
                            district:user.ownerInfo[0].district,
                            town:user.ownerInfo[0].town,
                            area:user.ownerInfo[0].area,
                            address:user.ownerInfo[0].address,
                            houseDescription:user.ownerInfo[0].houseDescription,
                            contactNumber:user.ownerInfo[0].contactNumber
                        });      
                    }  
             }
        })
    }
    else{
     res.sendFile(path.join(__dirname+'/public/login.html'));
 
       }
 })

 app.post("/findAddress",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
            {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
             }
            else{
                var state = req.body.state;
                var district = req.body.district;
                var town = req.body.town;
                var area = req.body.area;
               User.findOne({'ownerInfo.state':state,'ownerInfo.district':district,'ownerInfo.town':town,'ownerInfo.area':area}).then((user)=>
               {
                   if(!user)
                   {
                    res.sendFile(path.join(__dirname+'/public/noHomes.html'));
                   }
                   else{
                       res.render("result.hbs",{
                        firstName:user.firstName,
                        lastName:user.lastName,
                        email:user.email,
                        state:user.ownerInfo[0].state,
                        district:user.ownerInfo[0].district,
                        town:user.ownerInfo[0].town,
                        area:user.ownerInfo[0].area,
                        address:user.ownerInfo[0].address,
                        houseDescription:user.ownerInfo[0].houseDescription,
                        contactNumber:user.ownerInfo[0].contactNumber,
                        veg:user.ownerInfo[0].veg,
                        shop:user.ownerInfo[0].shop,
                        milk:user.ownerInfo[0].milk,
                        grocery:user.ownerInfo[0].grocery,
                        hospital:user.ownerInfo[0].hospital,
                        cinema:user.ownerInfo[0].cinema,
                        bus:user.ownerInfo[0].bus,
                        rail:user.ownerInfo[0].rail,
                        });
                   }
                                           
               })
            }
        })
    }
    else{
     res.sendFile(path.join(__dirname+'/public/login.html'));
 
       }
})

app.get("/changePassword",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
            {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
             }
            else{
                 res.render("changePassword.hbs");           
             }
        })
    }
    else{
     res.sendFile(path.join(__dirname+'/public/login.html'));
 
       }
})

app.post("/newPassword",(req,res)=>{
    if(req.session && req.session.user)
    {
        User.findOne({email:req.session.user.email}).then((user)=>{
            if(!user)
            {
                req.session.reset();
                res.sendFile(path.join(__dirname+'/public/login.html'));
             }
            else{
                   var currentPassword = req.body.currentPassword;
                   var newPassword = req.body.newPassword;
                   bcrypt.compare(currentPassword,user.password,(err,result)=>{
                    if(result===false)
                    {
                        res.status(400).sendFile(path.join(__dirname+'/public/invalidCurrentPassword.html'));
                    }

                    else{
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(newPassword,salt,(err,hash)=>{
                                User.updateOne({email:user.email},{password : hash},(e,result)=>{
                                    res.status(400).sendFile(path.join(__dirname+'/public/passwordChangeSuccess.html'));
                                })
                            })
                        })
                     }
                })
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

app.listen(port,() => {
    console.log(`Server is up on port ${port}`);
});