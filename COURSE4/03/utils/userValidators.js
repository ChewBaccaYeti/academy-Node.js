const Joi = require('joi');

exports.createUserDataValidator = (data) => {
    Joi.object()
        .options({ abortEarly: false })
        .keys({
            name: Joi.string().min(3).max(20).required(),
            job: Joi.string().required(),
            year: Joi.number().min(1970).max(2005).required(),
        })
        .validate(data);
};
