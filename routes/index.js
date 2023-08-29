const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('Welcome');
})

router.use('/question', require('./question'))
router.use('/options', require('./options'))

module.exports =  router;