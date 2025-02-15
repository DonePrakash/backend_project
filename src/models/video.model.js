import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
/*
    mongooseAggregatePaginate:
        A plugin to add pagination support to Mongoose's aggregation queries.
*/

const videoSchema = new Schema(
    {
        videoFile:{
            type: String,  // cloudinary url
            required:true
        },
        thumbnail:{
            type:String, // cloudinary url
            required:true
        },
        title:{
            type:String, 
            required:true
        },
        description:{
            type:String, 
            required:true
        },
        duration:{
            type:Number, // cloudinary url
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
    },{timestamps:true}
)
/*
    1. videoFile and thumbnail: URLs for the video file and thumbnail (from Cloudinary).
    2. title, description: Information about the video.
    3. duration: Duration of the video in seconds or minutes.
    4. views: Number of times the video has been watched, starting at 0.
    5. isPublished:
        If true, the video is public.
        If false, it's private or in draft.
    6. owner:
        References the User who uploaded the video.
        Sets up a relationship between the User and Video models.
*/

// Adds pagination support to the Video model
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)