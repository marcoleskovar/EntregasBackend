const button = document.getElementById('buyCart')

button.onclick = async () => {
    const cartID = button.dataset.cartId

    await fetch(`/api/carts/${cartID}/purchase`, {
        method: 'POST'
    })
}