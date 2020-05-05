var mongoose=require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{VALUE} is not an email'
        }
    },
    password:{
        type:String,
        minlength:6,
        require:true
    },
    firstName:{
        type:String,
        required: true
    },
    lastName:{
         type:String,
         required: true
    },
    phoneNumber:{
          type:Number,
          minlength:10,
          required:true,
          unique: true
    },
    securityQuestion:{
        type: String,
        required:true
    },
    securityAnswer:{
        type: String,
        required: true
    },
    ownerInfo:[{
        state:{
            type:String
        },
        district:{
            type:String
        },
        town:{
            type:String
        },
        area:{
            type:String
        },
        address:{
            type:String
        },
        houseDescription:{
            type:String
        },
        contactNumber:{
            type:Number,
            minlength:10
        },
        veg:{
            type:String,
        },
        shop:{
            type:String,
        },
        milk:{
            type:String,
        },
        grocery:{
            type:String,
        },
        hospital:{
            type:String,
        },
        cinema:{
            type:String,
        },
        bus:{
            type:String,
        },
        rail:{
            type:String,
        }
    }]
})

UserSchema.methods.toJSON = function()
{
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['firstName','lastName','email','phoneNumber','ownerInfo']);
}



UserSchema.pre('save',function(next)
{
    var user = this;
    if(user.isModified('password'))
    {
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password= hash;
                next();
            })
        })
    }
    else{
        next();
    }

})


var User=mongoose.model('User',UserSchema)

  


    module.exports={User};