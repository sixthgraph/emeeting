import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: [true, 'Please provide a fullname'],
    unique: true
  },
  username: {
    type: String,
    require: [true, 'Please provide a username'],
    unique: true
  },
  password: {
    type: String,
    require: [true, 'Please provide a password']
  },
  avatar: {
    type: String
  },
  avatarColor: {
    type: String
  },
  currentPlan: {
    type: String
  },
  company: {
    type: String
  },
  country: {
    type: String
  },
  contact: {
    type: String
  },
  email: {
    type: String,
    require: [true, 'Please provide a email'],
    unique: true
  },
  role: {
    type: String,
    default: 'subscriber'
  },
  status: {
    type: String,
    default: 'active'
  },
  billing: {
    type: String
  }
})

const User = mongoose.models.users || mongoose.model('users', userSchema)

export default User
