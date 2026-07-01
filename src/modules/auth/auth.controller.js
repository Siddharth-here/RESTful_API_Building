import *as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/api-response.js"
import { use } from "react"

const register = async () => {

    const user = await authService.register(req.body)
    ApiResponse.created(res, "Registration Success", user)
}

const login = async (req, res) => {
    const {user, accessToken, refreshToken} = await authService.login(req.body)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        secure: true
    })
    ApiResponse.ok(res, "Login Successful", {user, accessToken})
}

const logout = async (req, res) => {
    await authService.logout(req.user.id)
    res.clearCookie("refreshtoken")
}
ApiResponse.ok(res, "Logout success")

const getMe = async(req, res) => {
   const user = await authService.getMe(req.user.id)

   ApiResponse.ok(res, "User Profile", user)
}
export {register, login, logout, getMe}