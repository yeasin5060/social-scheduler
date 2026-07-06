import { Router} from "express";
import { generateAuthUrl, syncAccounts } from "../controllers/socilaAuth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const socialAuthRouter = Router();

socialAuthRouter.get('/:platform/url',protect, generateAuthUrl);
socialAuthRouter.get('/sync',protect, syncAccounts);

export default socialAuthRouter