import type { CartItem } from '@/interfaces';
import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { db, eq, inArray, Product, ProductImage } from 'astro:db';

// export const loadProductsFromCart = defineAction({
//     accept: 'json',
//     input: z.array(
//         z.object({
//             productId: z.string(),
//             quantity: z.number(),
//             price: z.number(),
//         }),
//     ),

//     handler: async (cart, { cookies } ) => {

//         console.log({cart });
        
//         // const cart = JSON.parse(ctx.cookies.get('cart')?.value ?? '[]' ) as CartItem[];
//         if( cart.length ===  0 ) return [];
        
//         return [];
//    }
//     });



export const loadProductsFromCart = defineAction({
    accept: 'json',

    handler: async (_, {cookies}) => {
        const cart = JSON.parse(cookies.get('cart')?.value ?? '[]' ) as CartItem[];
        
        if( cart.length ===  0 ) return [];

        //Load products from the cart
        const productIds = cart.map( item => item.productId );
        
        const dbProducts = await db
        .select()
        .from(Product)
        .innerJoin( ProductImage, eq(Product.id, ProductImage.productId) )
        .where( inArray(Product.id, productIds) )
        
        console.log("dbProducts",dbProducts);


        return cart.map( item => {;
            const dbProduct = dbProducts.find( p => p.Product.id === item.productId);

            if( !dbProduct ){
                throw new Error (`Product with id ${item.productId} not found`);
            }

            const { title, price, slug } = dbProduct.Product;
            const image = dbProduct.ProductImage.image;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: price,
                title: title,
                size: item.size,
                image: image.startsWith('http')
                    ? image
                    : (`${import.meta.env.PUBLIC_URL}/images/products/${image}`),
                slug: slug,
            }
        })
    },
});