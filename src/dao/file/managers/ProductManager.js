import fs from 'fs'

class ProductManager{
    constructor(){
        this._products = []
        this.filename = './dao/file/dataBase/products.json'
        this._format = 'utf-8'
    }

    lastId = async () => {
        try{
            const list = await this.getProducts()
            const maxId = list.reduce((max, product) => {
                return product.id > max ? product.id : max
            }, 0)
            return maxId
        }
        catch (error){
            throw new Error ('No se ha generado un ID')
        }
    }

    uniqueCode = async () => {
        const code = Math.random().toString(32).substring(7)
        return code
    }

    codeInUse = async (data) => {
        const list = await this.getProducts()
        const find = list.find(d => d.code === data.code)

        if (find) return true
        else return false
    }
    
    keyValue = async (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                if ('id' in (obj[key])) return false
                else return {success: true, result: (obj[key])}
            }
        }
        return false
    }

    fileContent = async (path, format) => {
        const list = await fs.promises.readFile(path, format)
        const parse = JSON.parse(list)
        
        if (!Array.isArray(parse)) throw new Error ('La dataBase tiene un formato erroneo')
        
        return parse
    }

    getProducts = async () => {
        if (fs.existsSync(this.filename)){
            this._products = await this.fileContent(this.filename, this._format)
            return this._products
        }else{
            await fs.promises.writeFile(this.filename, '[]', this._format)
            return this._products
        }
    }

    getProductById = async (id) => {
        const list = await this.getProducts()

        const find = list.find(d => d.id === parseInt(id))

        if (find) return find
        else return null
    }
    
    createProduct = async (data) => {
        if (Object.keys(data).length === 0) throw new Error ('body vacio')

        const list = await this.getProducts()
        const id = await this.lastId() + 1
        const code = await this.codeInUse(data)
        const newCode = await this.uniqueCode()

        if (code) throw new Error (`CODE already in use - Try using: ${newCode}`)

        data.id = id
        const pushear = list.push(data)

        if (!pushear) return null

        const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))

        if(write === undefined) return data
        else return null
    }

    updateProduct = async ({query, update, options}) => {
        const list = await this.getProducts()
        const idx = list.findIndex(d => d.id === parseInt(query._id))
        const newCode = await this.uniqueCode()
        const key = await this.keyValue(update)
        if (!key) throw new Error ('Modifying the ID directly is not allowed')
        if (key.success){
            const exist = await this.codeInUse(key.result)
            if (exist) throw new Error (`CODE already in use - Try using: '${newCode}'`)
        }

        const validProperties = ['title', 'description', 'price', 'thumbnail', 'code', 'category', 'stock', 'status']
    
        for (const prop in key.result){
            if (!validProperties.includes(prop)) {
                throw new Error(`Cannot add property '${prop}'`)
            }
        }

        list[idx] = Object.assign({}, list[idx], key.result)
        const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))
        if(write !== undefined) return null
        else return list[idx]
    }

    deleteProduct = async (id) => {
        const list = await this.getProducts()
        const updatedList = list.filter(item => item.id !== parseInt(id))
        
        const write = await fs.promises.writeFile(this.filename, JSON.stringify(updatedList, null, 2))
        if (write === undefined) return {deletedCount: 1}
        else return {deletedCount: -1}
    }

    paginateProducts = async () => {
        const docs = await this.getProducts()
        return { docs }
    }
}

export default ProductManager