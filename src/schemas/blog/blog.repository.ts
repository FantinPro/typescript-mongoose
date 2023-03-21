import { EntityRepository } from "../../core/entity.repository";
import { Blog, BlogModel } from "./blog.schema";

export class BlogRepository extends EntityRepository<Blog> {
    constructor() {
        super(BlogModel);
    }
}