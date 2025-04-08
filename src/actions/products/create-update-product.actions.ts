

import { ImageUpload } from '@/utils/image-upload';
import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { db, eq, Product, ProductImage } from 'astro:db';
import { getSession } from 'auth-astro/server';
import { v4 as UUID } from 'uuid';

const MAX_FILE_SIZE = 5_000_000; // 5MB
const ACEPTED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
    ];

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
        // Si fuera una única imagen no sería un z.aarray si no que se pondría el z.instanceof(File) y lo demás
        imageFiles: z.array(
            z.instanceof(File)
            .refine( file  => file.size <= MAX_FILE_SIZE, 'Max image size 5MB')
            .refine( file => {
                //if ( file.size === 0 ) return true; // Si no hay imagen, no se valida el tipo
                // Si hay imagen, se valida el tipo
                return ACEPTED_IMAGE_TYPES.includes(file.type);
            }, `Solamente soporta imágenes de tipo ${ACEPTED_IMAGE_TYPES.join(',')}`)
            ).optional(),
    }),
    handler: async (form, { request }) => {

        const session = await getSession( request );
        const user = session?.user;

        if ( !user ) {
            throw new Error('No user found');
        }

        const { id = UUID() , imageFiles, ...rest } = form;
        rest.slug = rest.slug.toLowerCase().replaceAll(' ', '_').trim();

        const product = {
            id: id,
            user: user.id!,
            ...rest,
            };

        const queries: any[] = []; 
        

        if ( !form.id ) {
            queries.push(db.insert(Product).values(product));
        } else {
            queries.push(db.update(Product).set(product).where(eq(Product.id, id)));
        };

        //imágenes
        const secureUrls: string[] = [];

        if (
            form.imageFiles &&
            form.imageFiles.length > 0 &&
            form.imageFiles[0].size > 0
        ) {
            const urls = await Promise.all(
                form.imageFiles.map( file => ImageUpload.upload(file)) 
            );

            secureUrls.push(...urls);
        }

        secureUrls.forEach( (imageUrl) => {
            const imageObj = {
            id: UUID(),
            image: imageUrl,
            productId: product.id,
        };
        
        queries.push(db.insert(ProductImage).values(imageObj));
        });

        // console.log('imageFile', imageFile);

        // imageFile?.forEach( async (imageFile) => {
        //     if ( imageFile.size <= 0) return;

        // const url = await ImageUpload.upload(imageFile)
        // })
        console.log('Product', {imageFiles})
        // await db.batch(queries);
        return product;
    },
});
