const express = require('express');
const router = express.Router();
const AddressControl = require('../controllers/address');


router.get('/', AddressControl.getAll);
router.post('/add', AddressControl.create);
router.get('/:id', AddressControl.getbyId);
router.put('/:id', AddressControl.update);
router.delete('/:id', AddressControl.delete);
router.delete('/',AddressControl.deleteAll);

module.exports = router;
