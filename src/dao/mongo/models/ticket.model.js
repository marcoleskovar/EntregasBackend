import mongoose from "mongoose"

const ticketCollection = 'tickets'
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: String,
    },
    products: [{
        _id: false,
        product: String,
        price: Number,
        quantity: Number,
        subtotal: Number
    }],
    totalAmount: Number,
    purchaser: {
        type: String,
        required: true,
    }
}, {
    versionKey: false
})

const TicketModel = mongoose.model(ticketCollection, ticketSchema)

export default TicketModel