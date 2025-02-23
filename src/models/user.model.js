import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
/*
    mongoose: A library used to interact with MongoDB using schemas and models.
    Schema: A structure that defines the shape of the documents in a MongoDB collection.
    jwt (JSON Web Token): Used for creating tokens to manage user authentication.
    bcrypt: A library used to hash passwords for secure storage.
*/

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,  // cloudinary url
            required:true,
        },
        coverImage:{
            type:String,  // cloudinary url
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            },
        ],
        password:{
            type:String,
            required:[true, 'Password is required']
        },
        refreshToken:{
            type:String
        }
    },{timestamps:true}
)
/*
    1. username:
        Must be a string and is required.
        unique: true: No two users can have the same username.
        lowercase: true: Converts the value to lowercase before saving.
        trim: true: Removes any extra spaces from the beginning and end.
        index: true: Makes searching by username faster.
    2. email: Similar to username but for the user's email there is no indexing.
    3. fullName: Stores the user's full name with indexing for faster search.
    4. avatar: Stores the URL of the user's profile picture (e.g., from Cloudinary).
    5. coverImage: URL for the user's cover photo (optional).
    6. watchHistory:
        An array of Object IDs referencing the Video model.
        This sets up a relationship to track which videos the user has watched.
    7. password:
        Stores the hashed password.
        required: [true, 'Password is required']: Custom error message if not provided.
    8. refreshToken:
        Stores the refresh token for re-authentication without logging in again.
    9. timestamps: true:
        Automatically adds createdAt and updatedAt fields.
*/

// Pre-save Hook for Password Hashing
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
/*
    1. This is a Mongoose middleware function that runs before saving a user document.
    2. Purpose:
        It checks if the password field has been modified.
        If modified, it hashes the password using bcrypt with a salt round of 10.
    3. Why use isModified()?
        To avoid re-hashing the password if it hasn’t been changed (e.g., updating the email).
*/

// Method to compare passwords
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
/*
    1. This method compares the plain text password with the hashed password stored in the database.
    2. Purpose:
        Used during login to verify if the entered password is correct.
*/

userSchema.methods.generateAccessToken = function(){
    return  jwt.sign(
        {
            _id:this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
/*
    1. A token is like a digital key that proves you are authorized to use an app or access certain parts of it.
    2. Why Do We Use Tokens?
        a. When a user logs in, the app gives them a token.
        b. The user then includes this token in every request they make (like viewing a profile or watching a video).
        c. The app checks the token to see if it's valid and belongs to a real user.
        d. If the token is valid, the app lets the user do what they want (like view a video). If not, it blocks them.
    3. generateAccessToken :
        A. Purpose:
            It creates an Access Token, which is a short-lived token used to prove the user's identity.
            This token is sent with every request the user makes (like viewing videos, liking posts, etc.).
            It usually expires quickly (e.g., in 1 day) for security reasons.
        B. jwt.sign(): This function creates a new token.
        C. Why Not Use it Forever?
            a. Access tokens have short lifespans to minimize the risk if someone steals the token.
            b. If the token is stolen, the attacker can only use it until it expires (e.g., 1 day).
*/

userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
/*
    1. generateRefreshToken :
        A. Purpose:
            a. It creates a Refresh Token, which is a longer-lived token.
            b. Its main job is to issue a new access token when the old one expires.
            c. It is not sent with every request, only when asking for a new access token.
            d. It usually lasts longer (e.g., 10 days) but is more secure because it's stored more safely (like in HTTP-only cookies).
        B. Example:
            a. The user logs in and receives:
                An access token (expires in 1 day)
                A refresh token (expires in 10 days)
            b. When the access token expires, the user sends the refresh token to get a new access token.
            c. The server checks if the refresh token is valid:
                If valid, it issues a new access token.
                If expired, the user has to log in again.
*/
export const User = mongoose.model('User',userSchema)