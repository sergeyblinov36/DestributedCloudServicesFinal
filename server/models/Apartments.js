const mongoose =require('mongoose');
const { Schema, model } = require('mongoose');


const ApartmentSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    requsts: [
        {reqId: {type: mongoose.Schema.Types.ObjectId, ref: 'Requests'}
    }],
    //star: [{
    //    user :{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    //    value: {type:Number}

    //}], //for ranc the apartment by user

    city:{type:String},
    address :{type: String},
    price:{type: Number},
    apartmentNum: {type: Number},
    priceFrom :{ type: Number },
    priceTo :{ type: Number },
    parcking: {type:String},
    neebrhood: {type:String }, 
    saftyChack: {type:Number},
    picturs: { type: Date, default: Date.now},
    desciption: {type:String},
    rooms: {type:Number},
    loftSize: {type:Number},
    pats: {type: String, enum: ["notAllow", "allow", "onlyCats", "smallPats"] },
    date: { type: Date, default: Date.now},
    //requst: [{ reqId: {type: mongoose.Schema.Types.ObjectId, ref: 'Requests'}}],
    openHouse:{
        open:{type: Boolean}, 
        public: {type: Boolean},
        date: {type: String},
        houre: {type: String},
    }, 
    openANDpublic: {type: Boolean ,default: false}, //need it for the search matode becose cant find inner object in find({})

    invated: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
    }],
    usersCamming:[{
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
    }] ,//only when open is true.... user can sign thenself

    status: {type: String ,enum: ["available", "ocupied"]}, 
    x: {type: String}, //this is for google maps - will be defined only in the view - client will chose dot on map
    y: {type: String},

}, { collection: 'aprtments' });


const Apartments = mongoose.model( 'Apartments' , ApartmentSchema); 
module.exports = Apartments;