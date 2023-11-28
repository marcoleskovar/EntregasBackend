const socket = io()

const formIs = document.getElementById('form')
const titleIs = document.getElementById('title')
const priceIs = document.getElementById('price')
const categoryIs = document.getElementById('category')
const stockIs = document.getElementById('stock')
const descriptionIs = document.getElementById('description')
const codeIs = document.getElementById('code')
const statusIs = document.getElementById('status')

formIs.onsubmit = async (e) => {
    e.preventDefault()

    const product = {
        title: titleIs.value,
        description: descriptionIs.value,
        price: priceIs.value,
        code: codeIs.value,
        category: categoryIs.value,
        stock: stockIs.value,
        status: statusIs.value
    }

    sendProduct(product)
}

const sendProduct = async (product) => {
    const fetchProd = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
            'Content-Type': 'application/json',
        }
    })

    if (fetchProd.status !== 500){
        const products = await fetch ('/api/products')
        const list = await products.json()
        formIs.reset()
        return socket.emit('newList', list.productos.reverse())
    }
    codeIs.value = ''
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
            if(field !==('_id') && field !==('__v') && field !== ('thumbnail')){
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