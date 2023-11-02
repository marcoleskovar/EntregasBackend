const formIs = document.getElementById('form')
const add = document.getElementById('agregar')
const socket = io()

add.onclick = async () => {

    const titleIs = document.getElementById('title').value
    const priceIs = document.getElementById('price').value
    const categoryIs = document.getElementById('category').value
    const stockIs = document.getElementById('stock').value
    const descriptionIs = document.getElementById('description').value
    const codeIs = document.getElementById('code').value
    const statusIs = document.getElementById('status').value

    const product = {
        title: titleIs,
        description: descriptionIs,
        price: priceIs,
        code: codeIs,
        category: categoryIs,
        stock: stockIs,
        status: statusIs
    }
    socket.emit('newProduct', product)
}