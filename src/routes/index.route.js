import { Router } from "express";
import linksRoutes from "./routeLink.js"
import rankRouter from "./routeRank.js";
import usersRoutes from "./userRoute.js";

const router = Router()

router.use(linksRoutes)
router.use(rankRouter)
router.use(usersRoutes)

export default router