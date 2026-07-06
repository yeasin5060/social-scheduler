import { Router} from "express";
import { generateAuthUrl, syncAccounts } from "../controllers/socilaAuth.controller.js";


const socialAuthRouter = Router();

socialAuthRouter.get('/:platform/url',generateAuthUrl);
socialAuthRouter.get('/sync',syncAccounts);

export default socialAuthRouter