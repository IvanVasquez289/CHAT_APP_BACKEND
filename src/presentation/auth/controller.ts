import { Request, Response } from "express";


export class AuthController {
    constructor() {}

    // Aquí puedes definir los métodos del controlador
    public signup = (req:Request,res:Response) => {
        res.send("Sign Up endpoint");
    }

    public login = (req:Request,res:Response) => {
        res.send("Log In endpoint");
    }

    public logout = (req:Request,res:Response) => {
        res.send("Log Out endpoint");
    }
}