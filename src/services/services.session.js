import ProductsModel from "../dao/models/model.products.js"

class ViewsServices {

    async queryParams (req) {
        const limit = parseInt(req.query?.limit ?? 10)
        const page = parseInt(req.query?.page ?? 1)
        const sort = req.query?.sort ?? ''
        const sortOptions = sort === 'asc' ? { price: 1 } : (sort === 'des' ? { price: -1 } : {})

        const result = await ProductsModel.paginate({}, {
                page,
                limit,
                sort: sortOptions,
                lean: true
        })
        result.sort = sort

        return result
    }

    async homeView (pag) {
        const res = pag
        const prevPage = res.prevPage
        const nextPage = res.nextPage
        const hasPrevPage = res.hasPrevPage
        const hasNextPage = res.hasNextPage
        return {
            success: true,
            paginate: {
                status: 'success', 
                payload: res.docs, 
                totalPages: res.totalPages,
                prevPage,
                nextPage,
                page: res.page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/?page=${prevPage}` : null,
                nextLink: hasNextPage ? `/?page=${nextPage}` : null
            }
        }
    }
}

export default ViewsServices