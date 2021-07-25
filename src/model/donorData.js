const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@fsd.vpxw6.mongodb.net/blooddonor?retryWrites=true&w=majority',
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
});
const schema = mongoose.Schema;

const DonorSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    blood:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    verified:{
        type:Boolean,
        required:true
    }
});

var donorData = mongoose.model('donorData',DonorSchema);
module.exports = donorData;