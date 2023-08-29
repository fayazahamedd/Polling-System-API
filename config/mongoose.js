const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/Polling`)

const connectParams={
    useNewUrlParser:true,
    useUnifiedTopology:true
}

const db =  mongoose.connection;

db.on('error', err => console.error);
db.once('open',  () => console.log('Connected to the Mongo DB'))