const jwt=require('jsonwebtoken');

module.exports=((req,res,next)=>{
if(req.method==='OPTIONS'){
return next()
}
const token=req.headers.authorization.split(' ')[1];
try{
if(!token){
    throw new Error('Authentication failed');
}

const decodedToken=jwt.verify(token, 'pterodaktil');
req.userData={userId: decodedToken.userId};
next()
} catch(err){
const error=new HttpError('Authentication failed',401);
return next(error);
}

})