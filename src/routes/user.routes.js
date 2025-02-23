import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

export default router

/*
    When a POST request is made to this URL:
    1. It goes through the userRouter.
    2. Matches the /register route.
    3. Executes the registerUser function.
    4. Responds with:
        {
            "message": "OK"
        }
*/