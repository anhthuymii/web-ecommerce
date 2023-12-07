import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// protected routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    // Remove the 'Bearer ' prefix and verify the token
    const tokenWithoutBearer = token.replace("Bearer ", "");
    // const decode = JWT.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // if (!decode || !decode._id) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid token format",
    //   });
    // }
    JWT.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid token or token has expired",
        });
      }

      req.user = decoded;
      next();
    });

    // Set user information in the request object
    // req.user = decode;
    // next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
