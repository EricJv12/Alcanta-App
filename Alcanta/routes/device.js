const express = require('express');
const router = express.Router();
const DeviceControl = require('../controllers/device');



router.get('/', DeviceControl.getAll);
router.get('/:id', DeviceControl.getbyId);
router.get('/byName/:name', DeviceControl.getbyName);
router.post('/add', DeviceControl.create);
router.put('/:id', DeviceControl.update);
router.delete('/:id', DeviceControl.delete);
router.delete('/deleteAll',DeviceControl.deleteAll);



module.exports = router;
