const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Password is mandatory as argument')
  process.exit(1)
}

const db_password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${db_password}@cluster0.gwpwk.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person
    .find({})
    .then(result => {
      console.log('phonebook:')
      if (result.length === 0) {
        console.log('phonebook is empty')
      } else {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
      }
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid number of arguments')
  process.exit(1)
}
