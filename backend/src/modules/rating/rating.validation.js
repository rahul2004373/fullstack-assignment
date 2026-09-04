import {z} from "zod"

const createRatingSchema = z.object({
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5")
})


export {createRatingSchema}