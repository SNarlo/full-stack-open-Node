const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sebastian:${password}@cluster0.f1soc.mongodb.net/Phonebook-App?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const phonebookSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', phonebookSchema)

const entry = new Entry({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv.length === 3) {
    //Retrieving entries from the phonebook
    Entry.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(entry => {
        console.log(`${entry.name} ${entry.number}`)
    });
    mongoose.connection.close()
})
}

if (process.argv.length === 5) {
    // Adding entry to the phonebook
    entry.save().then(result => {
    console.log(`Added ${entry.name} ${entry.number} to the phonebook!`)
    mongoose.connection.close()
    })
}



