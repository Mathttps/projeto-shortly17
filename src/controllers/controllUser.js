import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { db } from "../database/database.js";


// Função para validar se um email é válido
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        if (!isValidEmail(email)) {
            return res.status(422).send("Email inválido.");
        }

        const login = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if (!login.rowCount) return res.status(401).send("Usuário não encontrado.");

        const user = login.rows[0];

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).send("Senha incorreta.");
        }

        const token = uuidv4();

        await db.query(
            `INSERT INTO sessions ("userId", "token") VALUES ($1, $2);`,
            [user.id, token]
        );

        return res.status(200).send({ id: user.id, token });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(422).send("Erro ao fazer login.");
    }
}

export async function getUser(req, res) {
    const { userId } = res.locals;

    try {
        const userQuery = `
            SELECT u.id, u.name, SUM(su."visitorsCount") AS "visitCount",
            json_agg(json_build_object('id', su.id, 'url', su.url, 'shortUrl', su."shortUrl", 'visitCount', su."visitorsCount")) AS "shortenedUrls"
            FROM users u
            LEFT JOIN "shortedUrls" su ON u.id = su."userId"
            WHERE u.id = $1
            GROUP BY u.id;
        `;

        const userData = await db.query(userQuery, [userId]);
        if (userData.rowCount === 0) return res.sendStatus(404);

        const user = userData.rows[0];
        const { id, name, visitCount, shortenedUrls } = user;

        res.send({ id, name, visitCount, shortenedUrls });
    } catch (error) {
        console.error("Erro ao obter usuário:", error);
        res.status(500).send("Erro ao obter usuário.");
    }
}

export async function signUp(req, res) {
    const { name, email, password } = req.body;
    try {
        if (!isValidEmail(email)) {
            return res.status(422).send("Email inválido.");
        }

        const existingUser = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);
        if (existingUser.rowCount > 0) return res.status(409).send("E-mail já cadastrado.");

        const hashPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
            [name, email, hashPassword]
        );

        res.sendStatus(201);
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).send("Erro ao cadastrar usuário.");
    }
}


export async function usersLocal(req, res) {
    try {
      const userId = res.locals.userId;
      
      const user = await getDomainUser(userId);
      
      const short = await getShortById(userId);
      
      const visitCount = short.rows.reduce((acc, curr) => acc + curr.visitCount, 0);
      
      const completeUser = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        visitCount: visitCount,
        shortenedUrls: short.rows.map(row => ({ 
          id: row.id,
          url: row.url,
          shortUrl: row.shortUrl, 
        }))
      };
  
      res.status(200).send(completeUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }