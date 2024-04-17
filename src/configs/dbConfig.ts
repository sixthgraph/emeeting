import mongoose from 'mongoose'

// MongoDB connection error. Please make sure MongoDB is running. MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.

export async function dbConnect() {
  try {
    // mongoose.connect(process.env.DATABASE_URL!)
    mongoose.connect('mongodb+srv://sixthgraph:cRIXU5TuO266NPZz@cluster0.dzcgwns.mongodb.net/routeflow')
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log('MongoDB connected successfully')
    })
    connection.on('error', err => {
      console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
      process.exit()
    })
  } catch (error) {
    console.log('Something goes wrong! : dbConnect() error')
    console.log(error)
  }
}
