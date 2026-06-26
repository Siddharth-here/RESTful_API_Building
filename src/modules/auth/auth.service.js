import ApiError from "../../common/utils/api-error.js";
import { generateAccessToken, generateResetToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const register = async (name, email, password, role) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already exists");

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken

  })
  console.log(user);
  
  // TODO: send an email to user with token : rawtoken

  const userObj = user.toObject()
  delete userObj.password
  delete userObj.verificationToken

  return userObj

};

const login = async ({email, password}) => {
  //take email and find user in DB
  // then check if password is correct
  //check if verified or not

  const user = await User.findOne({email}.select("+password"))
  if (!user) throw ApiError.unauthorized("Invalid Email or Password")
    
  // somehow i will check password

  if(!user.isVerified){
    throw ApiError.forbidden("please verify your email before log in") 
  }

  const accessToken = generateAccessToken({id: user._id, role: user.role})

  const refreshToken= generateResetToken({id: user._id })

}

export { register };
