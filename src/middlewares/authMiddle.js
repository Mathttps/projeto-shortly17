import { db } from "../database/database.js";

export async function authValid(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '').trim();
    
    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [token]);

        if (!session.rowCount) {
            return res.sendStatus(401);
        }

        res.locals.userId = session.rows[0].userId;
        next();
    } catch (err) {
        return res.status(500).send(err.message);
    }
}
