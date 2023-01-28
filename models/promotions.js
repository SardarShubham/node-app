const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = Schema({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    label : {
        type : String,
        default : ""
    },
    price : {
        type : Currency,
        min : 0,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    feature : {
        type : Boolean,
        default : false
    } 
},
{
    timestamps : true
});

const promotions = mongoose.model('promotion', promotionSchema);
module.exports = promotions;

