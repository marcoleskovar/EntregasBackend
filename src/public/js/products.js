const socket = io()

const addToCart = document.querySelectorAll('.addToCart')

addToCart.forEach(button => {
    button.onclick = async () => {
        const welcomeMessage = document.getElementById('welcome')
        const cartID = welcomeMessage.dataset.cartId
        const productID = await button.dataset.productId

        await fetch(`/api/carts/${cartID}/products/${productID}`, {
            method: 'POST'
        })
    }
})