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
    amount: {
        type: Number,
        required: true,
        unique: true
    },
    purchaser: {
        type: String,
        required: true,
    }
}, {
    versionKey: false
})

const TicketModel = mongoose.model(ticketCollection, ticketSchema)

export default TicketModel