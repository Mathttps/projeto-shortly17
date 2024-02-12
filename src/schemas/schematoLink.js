import Joi from "joi";

export const schematoLink = Joi.object({
    url: Joi.string().required(),
    shortlyUrl: Joi.string().required()
})