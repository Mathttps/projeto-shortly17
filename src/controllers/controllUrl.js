import { db } from "../database/database.js";
import { nanoid } from "nanoid";

// Função para validar se um URL é válido
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export async function openShortUrl(req, res) {
    const { shortUrl } = req.params;
    try {
        const link = await db.query(
            `SELECT url FROM "shortedUrls" WHERE "shortUrl" = $1;`,
            [shortUrl]
        );
        if (!link.rowCount) return res.status(404).send("Shortly não encontrado.");

        const originalLink = link.rows[0].url;

        await db.query(
            `UPDATE "shortedUrls" SET "visitorsCount" = "visitorsCount" + 1 WHERE "shortUrl" = $1;`,
            [shortUrl]
        );
        res.redirect(originalLink);
    } catch (error) {
        console.error("Erro ao abrir URL encurtada:", error);
        res.status(500).send("Erro ao abrir URL encurtada.");
    }
}

export async function getUrlId(req, res) {
    const { id } = req.params;
    try {
        const getShortUrl = await db.query(
            `SELECT id, "shortUrl", "url" FROM "shortedUrls" WHERE id = $1;`,
            [id]
        );
        if (!getShortUrl.rowCount) return res.sendStatus(404);

        return res.status(200).send(getShortUrl.rows[0]);
    } catch (error) {
        console.error("Erro ao obter URL por ID:", error);
        res.status(500).send("Erro ao obter URL por ID.");
    }
}

export async function redirectUrl(req, res) {
    const { shortUrl } = req.params;
    try {
        const shortUrlInfo = await getUrlShort(shortUrl);
        if (shortUrlInfo.rowCount === 0) return res.sendStatus(404);
        const urlInfo = await getUrlShortById(shortUrlInfo.rows[0].id);
        await updateUrl(urlInfo.rows[0].id);
        res.redirect(urlInfo.rows[0].url);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function getShortly(req, res) {
    const { url } = req.body;
    const shortUrl = nanoid(10);

    try {
        if (!isValidUrl(url)) {
            return res.status(422).send("URL inválido.");
        }

        const responseInsert = await db.query(
            `INSERT INTO "shortedUrls" ("userId", "url", "shortUrl") VALUES ($1, $2, $3) RETURNING id;`,
            [res.locals.userId, url, shortUrl]
        );

        return res.status(201).send({ id: responseInsert.rows[0].id, shortUrl });
    } catch (error) {
        console.error("Erro ao encurtar URL:", error);
        res.status(500).send("Erro ao encurtar URL.");
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params;
    const userId = res.locals.userId;

    try {
        const urlToDelete = await db.query(
            `SELECT * FROM "shortedUrls" WHERE id = $1;`,
            [id]
        );
        if (!urlToDelete.rowCount) return res.sendStatus(404);
        if (urlToDelete.rows[0].userId !== userId) return res.sendStatus(401);

        await db.query(`DELETE FROM "shortedUrls" WHERE id = $1;`, [id]);
        res.status(204).send("Shortly excluído com sucesso!");
    } catch (error) {
        console.error("Erro ao excluir URL:", error);
        res.status(500).send("Erro ao excluir URL.");
    }
}
