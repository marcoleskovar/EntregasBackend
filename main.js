class ProductManager{

    constructor(){
        this._products = []
        this._id = 1
    }
    
    addProduct = ({title, description, price, thumbnail, code, stock}) => {
        if(!title || !description || !price || !thumbnail || !code || !stock) return console.log('Completa todos los campos');//valida que todos los campos sean completados

        if (this._products.some(product => product.code === code)) return console.log(`El producto que intentas agregar tiene el mismo code que otro producto (${code})`);//Valida que no se repita el code

        this._products.push({
            id: this._id++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        })
        console.log(`Se agrego correctamente el producto: ${title})`)
    }

    getProductById = (id) => {
        const productoEncontrado = this._products.find(product => product.id === id)
        productoEncontrado ? console.log(productoEncontrado): console.error('Not Found');
    }

    getProducts = () => {
        console.log(this._products);
    }
}

const productManager = new ProductManager ()

const productToAdd = {
    title: 'Producto 1',
    description: 'Descripcion Producto 1',
    price: 1000,
    thumbnail: './img/prod-1.webp',
    code: 'A1',
    stock: 30
}

const productToAdd2 = {
    title: 'Producto 2',
    description: 'Descripcion Producto 2',
    price: 200,
    thumbnail: './img/prod-2.webp',
    code: 'A2',
    stock: 5
}

const productToAdd3 = {
    title: 'Producto 3',
    description: 'Descripcion Producto 3',
    price: 5000,
    thumbnail: './img/prod-3.webp',
    code: 'A3',
    stock: 15
}

productManager.getProducts()//Muestro array de productos VACIO
productManager.addProduct(productToAdd)//Agrego el producto1
productManager.addProduct(productToAdd2)//Agrego el producto2
productManager.addProduct(productToAdd3)//Agrego el producto3
productManager.addProduct(productToAdd3)//Agrego OTRA VEZ producto 3 para que me tire ERROR a proposito
productManager.getProductById(2)//Encuentro a un elemento por su ID
productManager.getProducts()//Muestro array de productos LLENO