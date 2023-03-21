*Ce qu'il manque :*

```ts
const blog2 = await blogRepo.findOne(
        {},
        {},
        {
            lean: true,
            populate: [
                {
                    path: 'contributors',
                    populate: { // ici impossible de mettre un array (que object pour l'instant)
                        path: 'dog',
                        populate: {
                            path: 'breeder'
                        }
                    }
                },
                {
                    path: 'website',
                    populate: {
                        path: 'domain' // mettre de l'autocompletion au niveau de profondeur > 1
                    }
                }
            ],
        }
    );
```