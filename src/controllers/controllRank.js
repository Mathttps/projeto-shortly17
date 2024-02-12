import { db } from "../database/database.js";

export async function getRank(req, res) {
    try {
        const query = `
            SELECT u.id, u.name, COUNT(su.id) AS linksCount, SUM(su."visitorsCount") AS visitCount
            FROM users u
            LEFT JOIN "shortedUrls" su ON u.id = su."userId"
            GROUP BY u.id, u.name
            ORDER BY visitCount DESC
            LIMIT 10;
        `;
        
        const response = await db.query(query);
        return res.send(response.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

// import { getRank } from "../repositories/reposRanking.js";

// export async function rankGet(req, res) {
//   try {
//     const { rows } = await getRank();

//     rows.sort((a, b) => b.visitCount - a.visitCount);
    

//     const topUsers = rows.slice(0, 10);
    
    
//     res.status(200).json(topUsers.map(user => ({
//       id: user.id,
//       name: user.name,
//       linksCount: user.linksCount,
//       visitCount: user.visitCount
//     })));
//   } catch (err) {
//     console.error("Erro ao obter links:", err);
//     res.status(500).json({ error: "Erro ao processar a solicitação" });
//   }
// }