import { Router } from "express";
import { registerUser, loginUser, logoutUser} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)


export default router

/*
    How It Works?
    1. Request Flow:
        a. When a POST request is made to /register, the request first goes through the upload.fields middleware.
        b. The middleware processes the uploaded files (avatar and cover image) and attaches them to req.files.
        c. After the middleware completes, the request is passed to the registerUser controller function.

    2. File Uploads:
        A. The upload.fields middleware ensures that:
            a. The avatar file is uploaded (required).
            b. The coverImage file is optional.
            c. Both files are temporarily stored on the server and made available in req.files.

    3. Controller Logic:
        A. The registerUser function handles the actual user registration logic, such as:
            a. Validating input.
            b. Uploading files to Cloudinary.
            c. Creating a new user in the database.
            d. Sending a response back to the client.
*/

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

/*
    A POST request is one of the fundamental HTTP methods used to send data to a server to create or update a resource. It is 
    commonly used when the client needs to submit data to the server, such as when filling out a form, uploading a file, 
    or creating a new record in a database.
*/

/*
    1.  import { Router } from "express";
        import { registerUser } from "../controllers/user.controller.js";
        import { upload } from "../middlewares/multer.middleware.js";

        Router: This is a class from the express library used to create modular, mountable route handlers.
        registerUser: This is the controller function that handles the logic for user registration. It is imported from user.controller.js.
        upload: This is a middleware function from multer.middleware.js that handles file uploads. It is configured 
                to process multipart/form-data, which is used for file uploads.

    2.  Creating a Router Instance :
        const router = Router();

        Router(): Creates a new router object. This router can be used to define routes and middleware specific to a group of endpoints.
        router: The variable that holds the router instance.
    
    3.  Defining the /register Route :
        router.route("/register").post(
            upload.fields([
                {
                    name: "avatar",
                    maxCount: 1
                },
                {
                    name: "coverImage",
                    maxCount: 1
                }
            ]),
            registerUser
        );

        router.route("/register"): Defines a route for the /register endpoint.
        .post(): Specifies that this route handles HTTP POST requests.

        Middleware: upload.fields
            upload.fields([...]): This is a middleware function provided by multer that processes multiple file uploads.
                name: "avatar": Specifies that the field name for the avatar file in the form data is avatar.
                maxCount: 1: Limits the number of files for the avatar field to 1.
                name: "coverImage": Specifies that the field name for the cover image file in the form data is coverImage.
                maxCount: 1: Limits the number of files for the coverImage field to 1.

        Controller: registerUser
            registerUser: This is the controller function that will handle the request after the file upload middleware processes the files.
*/