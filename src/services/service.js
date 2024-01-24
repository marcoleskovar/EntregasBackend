import { Product, Cart } from "../dao/factory.js"

import ProductRepository from "./products.repository.js"
import CartRepository from "./services.cart.js"

export const ProductService = new ProductRepository(new Product())
export const CartService = new CartRepository(new Cart())