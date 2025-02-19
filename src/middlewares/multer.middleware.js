import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
  
export const upload = multer({ 
    storage, 
})

/*
    1. const storage = multer.diskStorage({

        a. multer.diskStorage() tells Multer to store files on the server's disk (hard drive).
        b. Instead of using default memory storage, this lets us control the destination and filename.
    2. destination: function (req, file, cb) {
            cb(null, "./public/temp")
        }

        a. destination specifies where to store the uploaded files.
        b. The function has 3 parameters:
            req → The request object.
            file → The file being uploaded.
            cb → A callback function to specify the folder.
        c. cb(null, "./public/temp") tells Multer to store files in the public/temp/ folder.
    3. filename: function (req, file, cb) {
            cb(null, file.originalname)
        }

        a. filename controls the name of the uploaded file.
        b. file.originalname means the file will be saved with the same name as it was uploaded.
        c. If multiple files with the same name are uploaded, they will overwrite each other unless handled 
            properly (e.g., appending a timestamp).
    4. export const upload = multer({ storage });

        a. multer({ storage }) creates a Multer instance using the custom storage settings.
        b. This exports upload, which can be used as a middleware in your Express routes.
*/