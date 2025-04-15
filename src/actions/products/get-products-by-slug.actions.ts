

import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { db, Product, eq, ProductImage } from 'astro:db';

const newProduct = {
    id: '',
    description: 'Nueva descripción',
    gender:'men',
    price: 100,
    sizes: 'XS, S, M',
    slug:'nuevo-producto',
    stock:0,
    tags:'shirts, men, new',
    title:'Nuevo Producto',
    type:'shirts',
}

export const getProductBySlug = defineAction({
    accept: 'json',
    input: z.string(),
    
    handler: async (slug) => {

        if (slug === 'new') {
            return {
                product: newProduct,
                images: [],
            };
        }

        const [product] = await db
        .select()
        .from(Product)
        .where(eq(Product.slug, slug));

    if ( !product) {
        throw new Error(`Product with slug ${slug} not found`);
    }

    const images = await db
    .select()
    .from(ProductImage)
    .where(eq(ProductImage.productId, product.id));

    return {
        product: product,
        images: images
        // images: images.map( ( i ) => i.image),
    };

    }

    });
