const formIs = document.getElementById('form')
const add = document.getElementById('agregar')
const socket = io()

add.onclick = async (e) => {
    e.preventDefault()
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
        socket.emit('newList', list.productos.reverse())
}

const deleteProduct = async (id) => {
    try{
        await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        })
        const products = await fetch ('/api/products')
        const result = await products.json()
        socket.emit('newList', result.productos.reverse())
    }
    catch(error){
        console.log(error)
    }
}

socket.on('updatedProducts', async products => {
    const container = document.getElementById('productList')
    container.innerHTML = ''

    products.forEach(element => {
        const productDiv = document.createElement('div')
        const separation = document.createElement('hr')
        const deleteBtn = document.createElement('button')
        
        const productFields = Object.keys(element)
        productFields.forEach(field => {
            if(field !=='_id'){
                const labelElement = document.createElement('span')
                const valueElement = document.createElement('span')
    
                labelElement.textContent = `${field}: `
                valueElement.textContent = element[field]
                
                const elementTag = field === 'title' ? 'h2' : 'h4'
                const newElement = document.createElement(elementTag)
                newElement.appendChild(labelElement)
                newElement.appendChild(valueElement)
                productDiv.appendChild(newElement)
            }
        })

        deleteBtn.textContent = 'Eliminar'
        deleteBtn.onclick = function (){
            deleteProduct(element._id)
        }

        container.appendChild(productDiv)
        container.appendChild(deleteBtn)
        container.appendChild(separation)
    })
})