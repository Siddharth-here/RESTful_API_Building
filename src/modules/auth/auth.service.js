import ApiError from "../../common/utils/api-error.js";
import { generateAccessToken, generateResetToken, verifyRefreshToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const hashedToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

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

  user.refreshToken = hashToken(refreshToken)
  await user.save()

  const userObj = user.toObject()
  delete userObj.password
  delete userObj.refreshToken

  return {user: userObj, accessToken, refreshToken}

}

const refresh = async (token) => {
  if(!token) throw ApiError.unauthorized("Refresh token missing")
  //verify
  const decoded = verifyRefreshToken(token)

  const user = await User.findById(decoded.id).select("+refreshToken")
  if(!user) throw ApiError.unauthorized("User not found")

    if(user.refreshToken !== hashToken(token)){
      throw ApiError.unauthorized("Invalid refresh token");
      
    }
}

export { register };
