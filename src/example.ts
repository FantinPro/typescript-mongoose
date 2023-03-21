import { BlogRepository } from "./schemas/blog/blog.repository";

const blogRepo = new BlogRepository();

async function main() {
    const blog1 = await blogRepo.findOne(
        { title: "ok", content: "ok" },
        {},
        { lean: true, populate: ["contributors", "website"] }
    );
    blog1;

    const blog2 = await blogRepo.findOne(
        {  },
        { title: 1 },
        {
            // attention, lean: false ne marchera pas comme attendu car le typage de mongoose est mal fait
            // du coup j'ai ouvert une issue lol
            // https://github.com/Automattic/mongoose/issues/13142
            lean: true, 
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
