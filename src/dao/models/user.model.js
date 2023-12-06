import mongoose from "mongoose"

const userCollection = 'users'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    gender: String
    
})

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel