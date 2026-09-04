import express from "express"

import {
    createOrUpdateRating,
    getStoreRatingsController,
    getMyRatingController
} from "./rating.controller.js"

import authMiddleware from "../../middlewares/auth.middleware.js"
import authorizeRoles from "../../middlewares/role.middleware.js"
import validate from "../../middlewares/validate.middleware.js"

import {
    createRatingSchema
} from "./rating.validation.js"


const router = express.Router()


// Get my rating
router.get(
    "/:storeId/my",
    authMiddleware,
    authorizeRoles("normal_user"),
    getMyRatingController
)


// Submit or modify rating
router.post(
    "/:storeId",
    authMiddleware,
    authorizeRoles("normal_user"),
    validate(createRatingSchema),
    createOrUpdateRating
)


// Get all ratings for a store
router.get(
    "/:storeId",
    authMiddleware,
    getStoreRatingsController
)


export default router