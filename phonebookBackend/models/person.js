const mongoose = require('mongoose')
const logger = require('../utils/logger')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{5,}/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedOject) => {
    returnedOject.id = returnedOject._id.toString()
    delete returnedOject._id
    delete returnedOject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
