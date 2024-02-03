import mongoose from "mongoose"
import moment from "moment"

const ticketCollection = 'tickets'
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: Math.random().toString(32).substring(7)
    },
    purchase_datetime: {
        type: String,
        default: moment().format("DD-MM-YYYY - hh:mm a")
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