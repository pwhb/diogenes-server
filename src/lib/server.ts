import { Application } from "express";
import rootRouter from "./routes/root";

export default function configureServer(app: Application)
{
    app.use("/", rootRouter)
}

