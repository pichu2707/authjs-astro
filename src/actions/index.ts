import {loginUser, logout, registerUser} from './auth';
import { getProductsByPage } from './products/get-products-by-page.actions';
import { getProductBySlug } from './products/get-products-by-slug.actions';

export const server = {
    //actions

    //auth
    loginUser,
    logout,
    registerUser,

    //products
    getProductsByPage,
    getProductBySlug,
};