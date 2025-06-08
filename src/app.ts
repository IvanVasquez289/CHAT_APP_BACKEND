import { ConnectDB } from "./data/mongo/init"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server"
import 'dotenv/config'
(async()=> {
    main()
})()

async function main(){
    const server = new Server({
        port: process.env.PORT!,
        routes:  AppRoutes.routes
    })
    await ConnectDB.init()
    server.start()
}