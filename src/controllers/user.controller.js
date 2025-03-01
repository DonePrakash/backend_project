import  { asyncHandler }  from "../utils/asyncHandler.js";
import { ApiError } from  "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

/*
    import { asyncHandler } from "../utils/asyncHandler.js";
    import { ApiError } from "../utils/apiError.js";
    import { User } from "../models/user.model.js";
    import { uploadOnCloudinary } from "../utils/cloudinary.js";
    import { ApiResponse } from "../utils/apiResponse.js";

    asyncHandler: A utility function to handle asynchronous operations and catch errors automatically.
    ApiError: A custom error class to standardize error responses.
    User: The Mongoose model representing the user schema in the database.
    uploadOnCloudinary: A utility function to upload files to Cloudinary, a cloud-based image and video management service.
    ApiResponse: A custom response class to standardize success responses.
*/

const registerUser = asyncHandler( async (req,res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username,email
    // check for images, check for avatar
    // upload them to cloudinary but must check avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    // get user details from frontend - here we are doing it using postman
    const {fullName,email,username,password} = req.body
    // console.log("email: ",email);
    // console.log(req.body);
    
    // if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    // }


    // validation - not empty
    if(
        [fullName, email, username, password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists : username,email
    const existedUser = await User.findOne({
        $or:[{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email and username already exists")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;

    // If there is no coverImage then we get this error : TypeError: Cannot read properties of undefined (reading '0') 
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // To handle the typeError issue we handle it like this
    let coverImageLocalPath;
    if((req.files) && Array.isArray(req.files.coverImage) && (req.files.coverImage.length > 0)){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    
    
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    // upload them to cloudinary but must check avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "fullname is required")
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    
})  




export {registerUser}

/*
    1. This line imports the asyncHandler utility from the utils folder.
    2. asyncHandler is typically a middleware function that wraps asynchronous route handlers to 
        manage errors gracefully, avoiding the need for multiple try-catch blocks.
*/

/*
    1. Defining the registerUser Function :
        const registerUser = asyncHandler(async (req, res) => {

        asyncHandler: Wraps the registerUser function to automatically catch any errors and pass them to the error-handling middleware.
        req: The request object containing data sent by the client.
        res: The response object used to send data back to the client.

    2. Extracting User Details from the Request Body :
        const { fullName, email, username, password } = req.body;
        console.log("email: ", email);

        req.body: Contains the data sent by the client (e.g., from a form submission).
        Destructuring: Extracts fullName, email, username, and password from req.body.
        console.log: Logs the email for debugging purposes (not recommended for production).

    3. Validation - Checking for Empty Fields :
        if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required");
        }

        This code is used to validate that none of the required fields (fullName, email, username, password) are empty or contain only whitespace. 
        If any field is empty, it throws a custom error (ApiError) with a 400 status code and a message indicating that all fields are required.

    4. Checking if User Already Exists :
        const existedUser = User.findOne({
            $or: [{ username }, { email }]
        });

        The query checks if either the username or the email in the database matches the values provided in the request.
        If a document is found that matches either condition, findOne returns that document.
        If no document matches, findOne returns null.

        User.findOne: Queries the database to find a user with the same username or email.
        $or: MongoDB operator to check if either condition is true.
        existedUser: Stores the result of the query.

    5. Throwing an Error if User Already Exists :
        if (existedUser) {
            throw new ApiError(409, "User with email and username already exists");
        }

    6. Handling File Uploads - Avatar and Cover Image :
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        a. req.files: This is an object containing the files uploaded by the client. It is typically populated by 
                    middleware like multer or express-fileupload.
        b. req.files?.avatar:
            The ?. (optional chaining) operator safely accesses the avatar property of req.files. If req.files or 
            req.files.avatar is null or undefined, it returns undefined instead of throwing an error.
            avatar refers to the field name used in the form or API request for the avatar file upload.
        c. [0]: The avatar field may contain an array of files (even if only one file is uploaded). [0] accesses the first file in the array.
        d. .path: This is the local file path where the uploaded file is temporarily stored on the server before 
                being processed (e.g., uploaded to Cloudinary).
        e. avatarLocalPath: Stores the local file path of the avatar.
    
    7. Uploading Files to Cloudinary :
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required");
        }

        uploadOnCloudinary: Uploads the local files to Cloudinary and returns the uploaded file details.
        Error Handling: Throws an error if the avatar upload fails.

    8. Creating a New User in the Database :
        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        });

        User.create: Creates a new user document in the database.
        avatar.url: Uses the Cloudinary URL for the avatar.
        coverImage?.url || "": Uses the Cloudinary URL for the cover image if it exists; otherwise, defaults to an empty string.
        username.toLowerCase(): Converts the username to lowercase to ensure consistency.

    9. Fetching the Created User Without Sensitive Information :
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        User.findById: Fetches the newly created user by their ID.
        .select("-password -refreshToken"): Excludes the password and refreshToken fields from the response for security reasons.

    10. Checking if User Creation was Successful :
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

    11. Returning a Success Response :
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered Successfully")
        );

        res.status(201): Sets the HTTP status code to 201 (Created).
        ApiResponse: Returns a standardized success response with the created user data and a success message.
*/

/*
    1. Named Export: export { registerUser }

        Characteristics :
        Named Export: Exports the registerUser function as a named export.
        Multiple Exports: A module can have multiple named exports.
        Explicit Import: When importing, the exact name (registerUser) must be used.
    2. Default Export: export default registerUser

        Characteristics :
        Default Export: A module can have only one default export.
        Flexible Import: When importing, you can use any name for the imported item.
        Common for Single Exports: Typically used when a module exports a single functionality (e.g., a single function, class, or object).
*/