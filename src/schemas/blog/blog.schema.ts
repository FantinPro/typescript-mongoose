import mongoose from "mongoose";
import { z } from "zod";
const { Schema } = mongoose;

const breederSchemaZod = z.object({
    name: z.string(),
    city: z.string(),
});

const domainSchemaZod = z.object({
    price: z.number(),
});

const dogSchemaZod = z.object({
    name: z.string(),
    kind: z.enum(["st", "stn"]),
    breeder: z.array(breederSchemaZod).brand<"relation">() ,
});

const contributorSchemaZod = z.object({
    name: z.string(),
    role: z.enum(["ADMIN", "BASIC"]),
    dog: dogSchemaZod.brand<"relation">(),
});

const websiteSchemaZod = z.object({
    name: z.string(),
    domain: domainSchemaZod.brand<"relation">(),
});

const blogSchemaZod = z.object({
    title: z.string(),
    comments: z.array(
        z.object({
            body: z.string(),
            date: z.date(),
        })
    ),
    content: z.string(),
    settings: z.object({
        isPublic: z.boolean(),
        isForSale: z.boolean(),
    }),
    contributors: z.array(contributorSchemaZod).brand<"relation">(),
    website: websiteSchemaZod.brand<"relation">(),
});

export type Blog = z.infer<typeof blogSchemaZod>;

const blogSchema = new Schema<Blog>({
    title: String,
    comments: [
        {
            body: String,
            date: Date,
        },
    ],
    content: String,
    settings: {
        isPublic: Boolean,
        isForSale: Boolean,
    },
});

export const BlogModel = mongoose.model("Blog", blogSchema);