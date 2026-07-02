import cookieParser from "cookie-parser"
import express from "express"
import authRoute from "./modules/auth/auth.routes.js"

const app = express() //initializes your web application so you can start defining how it handles HTTP requests (routes, middleware, etc.).

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/auth", authRoute)


export default app