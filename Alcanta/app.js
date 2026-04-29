/* const is like a import
* 
* to run in terminal: npm run dev
* it runs nodemon this service allows for automatic "refresh" instead of relaunching the app on every change.
*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

//Database
const db = require('./config/database');

//Test db
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: '+ err))


const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.urlencoded({extended: true}));

//Route to Index. (request, response) El homepage
app.get('/', (req, res)  => res.send('INDEX, estas en el principio')); 

//Routes
app.use('/account', require('./routes/account')); //For anything thats /account we want to require -path to account routes-
app.use('/address', require('./routes/address'));
app.use('/device', require('./routes/device'));
app.use('/measurement', require('./routes/measurement'));
app.use('/alarm', require('./routes/alarm'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log (`Server started on port ${PORT}`));

