//APPROACH 2 - DB connection in another file

import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

let cached = global.mongoose || { conn: null, promise: null }
global.mongoose = cached

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
        }).then((mongoose) => mongoose)
            .catch(err => {
                console.error("MongoDB connection failed:", err)
                throw err
            })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB