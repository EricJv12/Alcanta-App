const Account = require('../models/Account');

const AccountControl = 
{
    getAllAcc: async (req, res) => {
        try {
            const c = await Account.findAll();
            res.json(c);    
        } catch(error) {
            res.status(500).json({error: "Error getting Accounts"});

        }
    },

    createAcc: async (req, res) => {

        if(!req.body.name || !req.body.lname || !req.body.email || !req.body.password){
            res.status(400).send({
                message: "Field can't be empty!"
            })
            return
        }

        const fields = {
            fname: req.body.name,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password
        }

        Account.create({
            name: fields.fname,
            lname: fields.lname,
            email: fields.email,
            password: fields.password
        })
            .then(data => {
                res.send(data || "/n Entry has been succesfully added");
            })
            .catch(error => {
                res.status(500).send(
                    error || "Error occurred when adding entry to Accounts")
            })
    },

    
    updateAcc: async (req, res) => {
        const id = req.params.id;
        try 
        {
            const c = await Account.findByPk(id);
            if(!c)
                return res.status(404).send({error: "Account not found"});
            const fields = {
                fname: req.body.name,
                lname: req.body.lname,
                email: req.body.email,
                password: req.body.password
            }
            fname = req.body.name;
            lname= req.body.lname;
            email= req.body.email;
            password= req.body.password;

            if(fname)
                await c.update({name:fname})
            if(lname)
                await c.update({lname: lname})
            if(email)
                await c.update({email:email})
            if(password)
                await c.update({password:password})

            res.json("Entry was updated succesfully");
        }catch(error){
            res.status(500).send("Error updating record: " || error);
        }
    },

    getbyId: async (req, res) => {
        const id = req.params.id * 1;
        try{
            const c = await Account.findByPk(id);
            if(!c)
                return res.status(404).json({error: 'User not found'});
            res.json(c);
        }catch(error){
            res.status(500).json({error: "Error getting record"});
        }

    },

    deleteAcc: async (req, res) => {
        const id = req.params.id * 1;
        try {
            const c = await Account.findByPk(id);
            if(!c)
                return res.status(404).json({error: 'User not found'});
            
            await c.destroy();
            return res.json("Deleted entry");

        }catch (error){
            res.status(500).json({error: "Error deleting entries"});
        }
    },

    deleteAll: async (req, res) => {
        try{
            const c = await Account.destroy({
                truncate:true,
            });
            res.json("Accounts where deleted succesfully");
        }catch(error){
            res.status(500).json({error: "Error deleting account entries"});
        }
    }

}

module.exports = AccountControl;