import ApiError from "../../common/utils/api-error.js"
import User from "./auth.model.js"

const register = async (name, email, password, role) => {

    const existing = await User.findOne({email})
    if (existing) throw ApiError.conflict("Email already exists") 
}

export {register}