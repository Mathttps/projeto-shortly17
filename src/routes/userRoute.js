import { Router } from "express"
import { authValid } from "../middlewares/authMiddle.js"
import { validUser } from "../middlewares/userMiddle.js"
import {  signUp, getUser, signIn } from "../controllers/controllUser.js"


const usersRoutes = Router()

usersRoutes.get("/users/me", authValid, getUser)
usersRoutes.post("/signUp", validUser, signUp)
usersRoutes.post("/signIn", signIn)


export default usersRoutes