import { Router } from "express"
import { authValid } from "../middlewares/authMiddle.js"
import { deleteUrl, getUrlId, openShortUrl, getShortly } from "../controllers/controllLink.js"


const linksRoutes = Router()

linksRoutes.get("/urls/:id", getUrlId)
linksRoutes.get("/urls/open/:shortUrl", openShortUrl)
linksRoutes.delete("/urls/:id", authValid, deleteUrl)
linksRoutes.post("/urls/getShortly", authValid, getShortly)

export default linksRoutes