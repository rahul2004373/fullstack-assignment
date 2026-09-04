import {z} from "zod"

const createStoreSchema = z.object({
    name: z.string().min(20, "Store name must be at least 20 characters").max(60, "Store name cannot exceed 60 characters"),
    email: z.string().email("invalid email address"),
    address: z.string().max(400, "Address cannot exceed 400 characters"),
    ownerId: z.string().uuid("Invalid owner ID")
})

const updateStoreSchema = z.object({
    name: z.string().min(20).max(60).optional(),
    email: z.string().email().optional(),
    address: z.string().max(400).optional(),
    ownerId: z.string().uuid().optional()
})

export {
    createStoreSchema,updateStoreSchema
}