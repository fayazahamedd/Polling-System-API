const express = require('express');
const port = 8000;
const app =  express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = require('./config/mongoose');

app.use('/', require('./routes/index'))

app.listen(port, () => {
    console.log('connected to the port', + port)
})