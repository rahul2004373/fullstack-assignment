import {addOrUpdateRating,getRatingsForStore,getMyRating} from "./rating.service.js"

import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"


const createOrUpdateRating = asyncHandler(async(req,res) => {

    const {storeId} = req.params
    const {rating} = req.body

    const result = await addOrUpdateRating(
        req.user.id,
        storeId,
        rating
    )


    const message = result.action === "created"
        ? "rating submitted successfully"
        : "rating updated successfully"


    return res.status(
        result.action === "created" ? 201 : 200
    ).json(
        new ApiResponse(
            result.action === "created" ? 201 : 200,
            message,
            result.rating
        )
    )

})


const getStoreRatingsController = asyncHandler(
    async(req,res) => {

        const {storeId} = req.params
        const {sortBy, sortOrder} = req.query

        const result = await getRatingsForStore(
            storeId,
            { sortBy, sortOrder }
        )


        return res.status(200).json(
            new ApiResponse(
                200,
                "ratings fetched successfully",
                result
            )
        )

    }
)


const getMyRatingController = asyncHandler(
    async(req,res) => {

        const {storeId} = req.params

        const rating = await getMyRating(
            req.user.id,
            storeId
        )


        return res.status(200).json(
            new ApiResponse(
                200,
                "your rating fetched successfully",
                rating
            )
        )

    }
)


export {
    createOrUpdateRating,
    getStoreRatingsController,
    getMyRatingController
}