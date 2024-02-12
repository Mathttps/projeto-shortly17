import { Router } from "express"
import { getRank } from "../controllers/controllRank.js"

const rankRouter = Router()

rankRouter.get("/ranking", getRank)

export default rankRouter