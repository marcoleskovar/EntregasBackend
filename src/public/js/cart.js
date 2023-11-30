const socket = io()

const addToCart = document.querySelectorAll('.addToCart')

addToCart.forEach(button => {
    button.onclick = async () => {
        const newCart = await fetch('/api/carts', {
            method: 'GET'
        })
        const result = await newCart.json()

        if (result.cart.length === 0){
            await fetch('/api/carts', {
                method: 'POST'
            })
        }
        const cart = await fetch('/api/carts', {
            method: 'GET'
        })
        const cartResult = await cart.json(cart)
        const cartID = cartResult.cart[0]._id
        const productID = await button.dataset.productId

        await fetch(`/api/carts/${cartID}/products/${productID}`, {
            method: 'POST'
        })
    }
})