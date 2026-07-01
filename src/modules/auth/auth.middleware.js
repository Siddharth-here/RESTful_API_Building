import { verify } from "jsonwebtoken";
import ApiError from "../../common/utils/api-error";

import User from "./auth.model.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils";

const authenticate = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) throw ApiError.unauthorized("Not Authenticated");
  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id);//db call

  if (!user) throw ApiError.unauthorized("user no longer exists");

  req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
  };
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden("You dont have permission");
    }
    next()
  };
};

export { authenticate, authorize };
