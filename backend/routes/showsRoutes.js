const express = require('express');
const router = express.Router();
const showsController = require('../controllers/showsController');

router.post('/create', showsController.createShow);
router.get('/get_all', showsController.getAllShows);
router.get('/get_by_movie/:id', showsController.getAllShowById);
router.delete('/delete/:id', showsController.deleteShow);
router.put('/:id/update', showsController.updateShow);
router.get('/get_by_id/:id', showsController.showById);

module.exports = router;

