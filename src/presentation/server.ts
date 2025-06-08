import { Router } from "express";
import express from 'express';

type ServerOptions = {
    port:  string;
    routes: Router
}
export class Server {
    public app = express()
    private readonly port: string;
    private readonly routes: Router;
    private serverListener: any;

    constructor(options: ServerOptions){
        this.port = options.port;
        this.routes = options.routes;
    }


    public start(){
        // middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // routes
        this.app.use(this.routes);

        // start server
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        })

    }

    public stop(){
        this.serverListener.close();
    }

}


