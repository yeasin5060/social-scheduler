import { Router} from "express";
import { addAccount, disconnectedAccount, getAccounts } from "../controllers/accounts.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const accountRouter = Router();

accountRouter.get('/' , protect, getAccounts);
accountRouter.post('/' , protect, addAccount);
accountRouter.get('/:id' , protect, disconnectedAccount);

export default accountRouter;
