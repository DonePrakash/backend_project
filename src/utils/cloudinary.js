import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// Configuration means setting up something with the necessary details so that it works properly.
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
/*
    This configures (sets up) Cloudinary with your account details (cloud name, API key, and secret).
    Without this configuration, Cloudinary won’t know which account to use when uploading files.
*/

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // File has been uploaded successfully
        console.log("File is uploaded on cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}
/*
    1. const uploadOnCloudinary = async (localFilePath) => {

        This is an async function named uploadOnCloudinary.
        It takes one parameter: localFilePath, which is the location of the file on your local system.
    2. Check if file exists
        try {
            if(!localFilePath) return null;

        It first checks if localFilePath is empty or undefined.
        If there's no file path, it returns null immediately.
    3. Upload files to cloudinary
        const response = await cloudinary.uploader.upload
        (localFilePath, {
            resource_type: "auto"
        });

        Calls cloudinary.uploader.upload() to upload the file to Cloudinary.
        The second argument { resource_type: "auto" } tells Cloudinary to detect the file type automatically (image, video, etc.).
        The await keyword waits for the upload process to finish before moving to the next line.
    4. fs.unlinkSync(localFilePath):
        This deletes the local file to free up space since the upload failed.
*/

// cloudinary.v2.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", 
//     {public_id: 'shoes'},
//     function(error, result) {
//         console.log(result); 
//     }
// );
     
export {uploadOnCloudinary}

/*
    This file does the following:
    1. Configures Cloudinary using .env credentials.
    2. Defines uploadOnCloudinary() to upload a file to Cloudinary and return its URL.
*/