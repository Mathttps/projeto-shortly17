import { Router } from "express";
import urlRoutes from "./routeUrl.js"
import rankRouter from "./routeRank.js";
import usersRoutes from "./userRoute.js";

const router = Router()

router.use(urlRoutes)
router.use(rankRouter)
router.use(usersRoutes)

export default router