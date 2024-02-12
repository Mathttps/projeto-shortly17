import { db } from "../database/database.js";

export async function getRank(req, res) {
    try {
        const query = `
            SELECT u.id, u.name, COALESCE(COUNT(su.id), 0) AS linksCount, COALESCE(SUM(su."visitorsCount"), 0) AS visitCount
            FROM users u
            LEFT JOIN "shortedUrls" su ON u.id = su."userId"
            GROUP BY u.id, u.name
            ORDER BY visitCount DESC
            LIMIT 10;
        `;
        
        const response = await db.query(query);
        

        const formattedResponse = response.rows.map(user => ({
            id: user.id,
            name: user.name,
            linksCount: user.linksCount,
            visitCount: user.visitCount
        }));
        
        const missingUsersCount = 10 - formattedResponse.length;
        for (let i = 0; i < missingUsersCount; i++) {
            formattedResponse.push({
                id: null,
                name: null,
                linksCount: 0,
                visitCount: 0
            });
        }
        
        return res.status(200).json(formattedResponse);
    } catch (err) {
        console.error("Erro ao obter o ranking de usuários:", err);
        return res.status(500).send("Erro ao obter o ranking de usuários.");
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