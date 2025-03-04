import {ApiError} from "../utils/ApiError.js"

const checkAuthorization=function(role=[]){
  return function(req,res,next){
    const user = req.user;
    if(!user){
      return next (new ApiError(403,"Unauthorized request"))
    }
    if(role.length>0 &&!role.includes(user.role)){
      return next(new ApiError(403,"You are not authorized to access this"))
    }
    next();
  }
}

export {checkAuthorization}