const Address = require('../models/Address');

const AddressControl = 
{
    getAll: async (req, res) => {
        try {
            const address = await Address.findAll();
            res.json(address);
        } catch(error) {
            res.status(500).json({error: "Error getting Address data"});

        }
    },
    
create: async (req, res) => {
    if(!req.body.address || !req.body.state || !req.body.city || !req.body.zip){
        res.status(400).send({
            message: "Field can't be empty!"
        })
        return
    }
    const fields = {
        address: req.body.address,
        address_two: req.body.address_two,
        state: req.body.state,
        city: req.body.city,
        zip: req.body.zip
    }
    Address.create(fields)
        .then(data => {
            res.send(data || "/n Entry has been succesfully added");
        })
        .catch(error => {
            res.status(500).send(
                error, "Error occurred when adding entry to Address")
        })
},

update: async (req, res) => {
    const id = req.params.id;
    try 
    {
        const c = await Address.findByPk(id);
        if(!c)
            return res.status(404).send({error: "Address not found"});
        const fields = {
            address: req.body.address,
            address_two: req.body.address_two,
            state: req.body.state,
            city: req.body.city,
            zip: req.body.zip
        }

        //This can be deleted and replace var with fields.street for example.
        addr= fields.street;
        addr_two= fields.street_two;
        state= fields.state;
        city= fields.city;
        zip= fields.zip;

        if(addr)
            await c.update({address:addr})
        if(addr_two)
            await c.update({address_two: addr_two})
        if(state)
            await c.update({state: state})
        if(city)
            await c.update({city: city})
        if(zip)
            await c.update({zip : zip})

        res.json("Entry was updated succesfully");
    }catch(error){
        res.status(500).json({error: "Error updating record"});
    }
},

getbyId: async (req, res) => {
    const id = req.params.id * 1;
    try{
        const c = await Address.findByPk(id);
        if(!c)
            return res.status(404).json({error: 'Address not found'});
        res.json(c);
    }catch(error){
        res.status(500).json({error: "Error getting record"});
    }

},

delete: async (req, res) => {
    const id = req.params.id * 1;
    try {
        const c = await Address.findByPk(id);
        if(!c)
            return res.status(404).json({error: 'Address not found'});
        
        await c.destroy();
        return res.json("Deleted entry");

        }catch (error){
        res.status(500).json({error: "Error deleting entries"});
        }
    },

    deleteAll: async (req, res) => {
        try{
            const c = await Address.destroy({
                truncate:true,
            });
            res.json("Address entries where deleted succesfully");
        }catch(error){
            res.status(500).json({error: "Error deleting Address entries"});
        }
    }
};

module.exports = AddressControl;