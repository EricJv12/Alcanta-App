const express = require('express');
const router = express.Router();
const AccountControl = require('../controllers/account');

router.post('/add', AccountControl.createAcc);
router.get('/', AccountControl.getAllAcc);
router.get('/:id', AccountControl.getbyId);
router.put('/:id', AccountControl.updateAcc);
router.delete('/:id', AccountControl.deleteAcc);
router.delete('/',AccountControl.deleteAll);






module.exports = router;

