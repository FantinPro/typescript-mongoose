import { EntityRepository } from "../../core/entity.repository";
import { Blog, BlogModel } from "./blog.schema";

export class BlogRepository extends EntityRepository<Blog> {
    constructor() {
        super(BlogModel);
    }
}

const blogRepo = new BlogRepository();

async function main() {
    const blog1 = await blogRepo.findOne(
        { title: "ok", content: "ok" },
        {},
        { lean: true, populate: ["contributors", "website"] }
    );
    blog1;

    const blog2 = await blogRepo.findOne(
        {},
        { title: 1 },
        {
            populate: [
                {
                    path: 'contributors',
                    populate: {
                        path: 'dog',
                    }
                },
                {
                    path: 'website',
                    populate: {
                        path: 'domain'
                    }
                }
            ],
        }
    );

    blog2;
}
