import {loginUser, logout, registerUser} from './auth';
import { loadProductsFromCart } from './cart/load-products-from-cart.actions';
import { createUpdateProduct } from './products/create-update-product.actions';
import { getProductsByPage } from './products/get-products-by-page.actions';
import { getProductBySlug } from './products/get-products-by-slug.actions';
import { deleteProductImage } from './products/delete-product-image.actions';

export const server = {
    //actions
    
    //auth
    loginUser,
    logout,
    registerUser,

    //products
    getProductsByPage,
    getProductBySlug,

    //cart
    loadProductsFromCart,

    //Admin
    //Product
    createUpdateProduct,

    //Delete
    deleteProductImage,



};