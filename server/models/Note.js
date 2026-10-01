const mongoose= require('mongoose');
const notschema =new mongoose.Schema({
    title:{type : String, required :true},
    description: String,
},
{timestamps:true}
);

module.exports=mongoose.model('Note',notschema)