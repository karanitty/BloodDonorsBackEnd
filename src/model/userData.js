const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@fsd.vpxw6.mongodb.net/blooddonor?retryWrites=true&w=majority',
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
});
const schema = mongoose.Schema;

const UserSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }
});

var userData = mongoose.model('userData',UserSchema);
module.exports = userData;