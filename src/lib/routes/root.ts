import { Router } from "express";
import { indexController } from "../controllers/root";

const rootRouter = Router()

rootRouter.get('/', indexController)

export default rootRouter