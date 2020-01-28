const joi = require('joi');


const regisrerValidation = (data)=>{
    const schema={
        first_name: joi.string().min(3).required(),
        last_name: joi.string().min(3).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required(),
        role:joi.string().min(3)
    };
    return joi.validate(data, schema);
};

const loginValidation = (data)=>{
    const schema={
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    };
    return joi.validate(data, schema);
};


const craeteApartmentValidation = (data)=>{
    const schema={
        city: joi.string().min(3).required(),
        address: joi.string().min(3).required(),
        price: joi.number().min(2).required(),
        rooms: joi.number().min(1).required(),
        owner: joi.string(),
        apartmentNum: joi.number().required(),
        status: joi.string(),
        pats: joi.string(),
        parcking: joi.string(),
        neebrhood: joi.string(),
        saftyChack: joi.string(),
        desciption: joi.string(),
        loftSize: joi.string(),
        openHouse : joi.json()

    };
    return joi.validate(data, schema);
};

const craeteRequestsValidation = (data)=>{
    const schema={
        apartmnt: joi.string().required(),
        resiving: joi.string().required(),
        purpose: joi.string().required(),
        text: joi.string(),
        status: joi.string()
     

    };
    return joi.validate(data, schema);

};

const profileValidation = (data)=>{
    const schema={
        loction: joi.string().min(4).max(10),
        status: joi.string().min(4).max(10)
    };
    return joi.validate(data, schema);

};


const addRentValidation = (data)=>{
    const schema={
        address: joi.string().min(4).max(20).required(),
        city: joi.string().min(4).max(10).required(),
        from: joi.string().min(4).max(15).required(),
        to: joi.string().min(4).max(15).required(),
        leftCose:joi.string().required(),
        current: joi.string().required()
    };
    return joi.validate(data, schema);

};

const creatPostValidation = (data)=>{
    const schema={
        text: joi.string().min(1).max(50).required(),
    };
    return joi.validate(data, schema);
};


//Validation functions
module.exports =function validatProfileInput(data){
    data.apartmnts = 'undefined' ? '' : data.apartmnts ;
};



module.exports.regisrerValidation= regisrerValidation;
module.exports.loginValidation= loginValidation;
module.exports.craeteApartmentValidation= craeteApartmentValidation;
module.exports.craeteRequestsValidation= craeteRequestsValidation;
module.exports.profileValidation= profileValidation;
module.exports.addRentValidation= addRentValidation;
module.exports.creatPostValidation= creatPostValidation;





