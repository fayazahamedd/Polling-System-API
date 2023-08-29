const express = require('express');
const Router=express.Router()
const optionsController = require('../controller/option_contoller');


Router.post('/:id/options/create',optionsController.create);
Router.get('/:id/add_vote',optionsController.add_vote);
Router.delete('/delete/:id',optionsController.delete)

module.exports=Router