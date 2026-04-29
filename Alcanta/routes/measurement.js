const express = require('express');
const router = express.Router();
const MeasurementControl = require('../controllers/measurement');


router.get('/', MeasurementControl.getAll);
router.post('/addEntry', MeasurementControl.create);
router.get('/:id', MeasurementControl.getbyId);
router.delete('/:id', MeasurementControl.delete);
router.delete('/',MeasurementControl.deleteAll);


module.exports = router;
