import { NextFunction, Request, Response } from "express";
import  jwt from 'jsonwebtoken';
export const auth =(req:Request,res:Response,next:NextFunction)=>{
    let Token :any=req.headers['token'];
    jwt.verify(Token,"SecretKey123456789",function (err:any,decoded:any) {
        if(err){
            res.status(401).json({status:"unauthorized"})
        }
        else {
            let email=decoded['data'];
            req.headers.email=email
            next();
        }
    })
}