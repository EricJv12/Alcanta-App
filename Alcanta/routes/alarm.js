const express = require('express');
const router = express.Router();
const AlarmControl = require('../controllers/alarm');


router.get('/', AlarmControl.getAll);
router.post('/add', AlarmControl.create);
router.get('/:id', AlarmControl.getbyId);
router.put('/:id', AlarmControl.update);
router.delete('/:id', AlarmControl.delete);
router.delete('/',AlarmControl.deleteAll);


module.exports = router;
