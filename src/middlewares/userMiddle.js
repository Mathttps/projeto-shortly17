import { schematoUser } from "../schemas/schematoUsers.js";

export function validUser(req, res, next) {
    const { error } = schematoUser.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    next();
}
