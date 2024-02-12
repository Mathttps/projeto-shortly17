import { Router } from "express"
import { authValid } from "../middlewares/authMiddle.js"
import { deleteUrl, getUrlId, openShortUrl, getShortly } from "../controllers/controllLink.js"


const urlRoutes = Router()

urlRoutes.get("/urls/:id", getUrlId)
urlRoutes.get("/urls/open/:shortUrl", openShortUrl)
urlRoutes.delete("/urls/:id", authValid, deleteUrl)
urlRoutes.post("/urls/shorten", authValid, getShortly)

export default urlRoutes