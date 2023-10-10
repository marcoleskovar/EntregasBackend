const fs = require('fs')

class ProductManager{
    constructor(){
        this._products = []
        this._id = 1
        this._path = './productList.json'
        this._format = 'utf-8'
    }
    
    addProduct = async({ title, description, price, thumbnail, code, stock }) => {
        try{
            if (!title || !description || !price || !thumbnail || !code || !stock) return console.log('Completa todos los campos');

            const fileContent = await fs.promises.readFile(this._path, this._format);
            this._products = JSON.parse(fileContent);

            if (this._products.some(product => product.code === code)) return console.log(`El producto que intentas agregar tiene el mismo code que otro producto (${code})`);
            this._products.push({
                id: this._id++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
            });
            
            await fs.promises.writeFile(this._path, JSON.stringify(this._products, null, 2), this._format);
            console.log(`Se agregó correctamente el producto: ${title}`);
        }catch(error){
            console.log(error);
        }
    };
    getProducts = async() => {
        try{
            const fileContent = await fs.promises.readFile(this._path, this._format);
            this._products = JSON.parse(fileContent);
            console.log(this._products);
        }catch(error){
            if (error.code === 'ENOENT') {
                await fs.promises.writeFile(this._path, '[]', this._format);
                console.log('El archivo "productList.json" no existía y fue creado.');
            } else {
                console.log('HA OCURRIDO UN ERROR', error);
            }
        }
    }

    getProductById = async(id) => {
        try{
            const fileContent = await fs.promises.readFile(this._path, this._format);
            this._products = JSON.parse(fileContent)
            const productoEncontrado = this._products.find(product => product.id === id)
            productoEncontrado ? console.log(productoEncontrado): console.error('Not Found');
            return console.log('===============PRODUCTO ENCONTRADO===============');
        }
        catch(error){
            console.log(error);
        }
    }

    updateProduct = async (id, property) => {
        try {
            const fileContent = await fs.promises.readFile(this._path, this._format);
            this._products = JSON.parse(fileContent);
            const productIndex = this._products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                for (let propiedad in property) {
                    if (this._products[productIndex].hasOwnProperty(propiedad)) {
                        this._products[productIndex][propiedad] = property[propiedad];
                    }
                }
    
                await fs.promises.writeFile(this._path, JSON.stringify(this._products, null, 2), this._format);
                return console.log('Producto actualizado correctamente.');
            } else {
                console.error('Producto no encontrado.')
            }
        } catch (error) {
            console.error(error);
        }
    };

    deleteProduct = async (id) => {
        const fileContent = await fs.promises.readFile(this._path, this._format)
        this._products = JSON.parse (fileContent)
        const productoEncontrado = this._products.filter(products => products.id !== id)
        await fs.promises.writeFile(this._path, JSON.stringify(productoEncontrado, null, 2))
        return console.log('===============PRODUCTO MODIFICADO===============')
    }
}

const productManager = new ProductManager()

const productToAdd = {
    title: 'Producto 1',
    description: 'Descripcion Producto 1',
    price: 1000,
    thumbnail: './img/prod-1.webp',
    code: 'A1',
    stock: 30,
}

const productToAdd2 = {
    title: 'Producto 2',
    description: 'Descripcion Producto 1',
    price: 400,
    thumbnail: './img/prod-1.webp',
    code: 'A2',
    stock: 30,
}

const productToAdd3 = {
    title: 'Producto 3',
    description: 'Descripcion Producto 1',
    price: 2100,
    thumbnail: './img/prod-1.webp',
    code: 'A3',
    stock: 30,
}
const productToAdd4 = {
    title: 'Producto 4',
    description: 'Descripcion Producto 1',
    price: 4500,
    thumbnail: './img/prod-1.webp',
    code: 'A4',
    stock: 30,
}

const run = async () => {
    await productManager.getProducts()
    await productManager.addProduct(productToAdd)
    await productManager.addProduct(productToAdd2)
    await productManager.addProduct(productToAdd3)
    await productManager.addProduct(productToAdd4)
    await productManager.getProductById(2)
    await productManager.deleteProduct(3)
    await productManager.updateProduct(2, {
        title: 'MODIFICADO',
        description: 'Descripcion Producto MODIFICADO',
        price: 30000,
        thumbnail: './img/prod-1.webp',
        code: 'MODIFICADO'
    })
    await productManager.getProducts()
}

run()
    .catch(error => console.error(error))