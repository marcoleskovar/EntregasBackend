const formIs = document.getElementById('form')
const add = document.getElementById('agregar')
const socket = io()

add.onclick = async (e) => {
    e.preventDefault();
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

        await fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const products = await fetch ('/api/products')
        const list = await products.json()
        socket.emit('newList', list.data)
}

socket.on('all', async list => {
    const container = document.getElementById('productList')
    container.innerHTML = ''

    list.forEach(element => {
        const productDiv = document.createElement('div')

        const title = document.createElement('h2')
        title.textContent = element.title
        const price = document.createElement('h4')
        price.textContent = element.price
        const category = document.createElement('h4')
        category.textContent = element.category
        const stock = document.createElement('h4')
        stock.textContent = element.stock
        const description = document.createElement('h4')
        description.textContent = element.description
        const status = document.createElement('h4')
        status.textContent = element.status

        productDiv.appendChild(title)
        productDiv.appendChild(price)
        productDiv.appendChild(category)
        productDiv.appendChild(stock)
        productDiv.appendChild(description)
        productDiv.appendChild(status)

        container.appendChild(productDiv);
    });
});
