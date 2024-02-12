import { schematoLink } from "../schemas/schematoLink.js";

export function validSchema(req, res, next) {
    const { error } = schematoLink.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    next();
}
