const express = require('express');
const { registerUser, loginUser, getCompanies, getProyects, getStoryUsers, createStoriUser, getTickets, createTicket, updateTicket } = require('../controller/controller');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/companies', getCompanies);
router.get('/proyects', getProyects);
router.get('/storyUsers', getStoryUsers);
router.post('/createStoriUser', createStoriUser);
router.get('/getTickets', getTickets);
router.post('/createTicket', createTicket);
router.put('/updateTicket', updateTicket);

module.exports = router;
