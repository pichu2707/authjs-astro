

import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { db, eq, Product } from 'astro:db';
import { getSession } from 'auth-astro/server';
import { v4 as UUID } from 'uuid';


export const createUpdateProduct = defineAction({
    accept: 'json',
    input: z.object({
        id: z.string().optional(),
        description: z.string(),
        gender: z.string(),
        price: z.number(),
        sizes: z.string(),
        slug: z.string(),
        stock: z.number(),
        tags: z.string(),
        title: z.string(),
        type: z.string(),

        //TODO: add Image
    }),
    handler: async (form, { request }) => {

        const session = await getSession( request );
        const user = session?.user;

        if ( !user ) {
            throw new Error('No user found');
        }

        const { id = UUID() , ...rest } = form;
        rest.slug = rest.slug.toLowerCase().replaceAll(' ', '_').trim();

        const product = {
            id: id,
            user: user.id!,
            ...rest,
            };

        console.log({product})

        await db.update(Product).set(product).where(eq(Product.id,id)).run();
        //Crear
        //Update
        //Insert de imágenes

        return product;
    },
});
