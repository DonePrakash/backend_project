const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }




// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }


/*
    Conclusion : 
    1. asyncHandler is a higher-order function that wraps async route handlers to 
        automatically handle errors.
    2. It prevents code repetition by removing the need for try-catch blocks in every 
        route handler.
    3. It ensures Express catches errors by forwarding them to the next() function.
    4. It helps in writing cleaner and more maintainable code in Express applications.
*/