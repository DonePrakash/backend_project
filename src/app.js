import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors";

const app = express()

// Allow Specific Origins
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/users", userRouter)
// url : http://localhost:8000/api/v1/users/register

export { app }

/*
    1. app.use() -> Adds middleware to the Express app.

    2.  A. import express from "express"
            Imports the express framework to create a web server and manage routes.
        B. import cookieParser from "cookie-parser"
            Imports cookie-parser, a middleware that parses cookies attached to the client's requests. Useful for handling authentication 
            tokens or session data.
        C. import cors from "cors"
            Imports cors, a middleware that enables Cross-Origin Resource Sharing. This allows your server to handle requests from 
            different domains (important for frontend-backend communication).

    3. const app = express()
        Initializes an Express application instance, which is the core of your server. It provides methods like .get(), .post(), .use(), etc.

    4.  app.use(cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }))
        A. app.use()
            Adds middleware to your Express app. Middleware functions have access to the request (req), response (res), and the 
            next middleware function in the application's request-response cycle.
        B. cors({...})
            This function configures CORS settings:
                origin: process.env.CORS_ORIGIN → Allows requests only from the specified origin (e.g., http://localhost:3000).
                credentials: true → Ensures that cookies and authorization headers are included in cross-origin requests 
                (important for authentication).

    5.  app.use(express.json({ limit: "16kb" }))
        A. express.json({...})
            Built-in middleware that parses incoming JSON requests and makes the data available in req.body.
            limit: "16kb" → Limits the JSON payload size to 16 KB to prevent large, unwanted data uploads.

    6.  Middleware for URL-encoded Data Parsing

        app.use(express.urlencoded({ extended: true, limit: "16kb" }))

        express.urlencoded({...})
            Middleware that parses incoming requests with URL-encoded payloads (e.g., form submissions).
            extended: true → Allows nested objects in the request body (useful for complex data).
            limit: "16kb" → Limits the URL-encoded payload size to 16 KB.

    7.  Middleware for Serving Static Files

        app.use(express.static("public"))

        express.static("public")
            Serves static files (like images, CSS, HTML files) from the public folder.
            Example: If you place logo.png in the public folder, it can be accessed via http://localhost:8000/logo.png.

    8. Middleware for Cookie Parsing

        app.use(cookieParser())

        cookieParser()
            Parses cookies from the incoming request and makes them available in req.cookies.

    9. Registering Routes

        app.use("/api/v1/users", userRouter)

        app.use()
            Mounts the userRouter middleware under the /api/v1/users route.
            All routes defined inside userRouter will now be prefixed with /api/v1/users.
        Example URL:
        http://localhost:8000/api/v1/users/register → Maps to the register endpoint inside userRouter.
*/