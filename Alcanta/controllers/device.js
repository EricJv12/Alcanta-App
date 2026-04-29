/*
*   Controller for device
*/
const {Device, Address} = require('../models/Association');

const DeviceControl = 
{
    getAll: async (req, res) => {
        try {
            const data = await Device.findAll({include: Address});
            res.json(data);

        } catch(error) {
            console.error('Error getting data', error);
            res.status(500).json({error: "Error getting device data"});

        }
    },
    
    create: async (req, res) => {
        const fields = {
            devName: req.body.name,
            adId: req.body.id
        };
        const dName = fields.devName;
        const id = fields.adId;

        if(!dName || !id) {
            res.status(400).json({message: "Field can't be empty!"})
            return
        }

        const address = await Address.findByPk(id);
        if(!address){
            res.status(404).json({error: "Address not found"});
            return
        }
        try{
        const newDev = await Device.create({
            name:dName,
            address_id: id
        })
        res.json("Device has been added succesfully");
      }catch(error){
        res.status(500).send("Error creating new device" && error);
      }
    },
    
    update: async (req, res) => {
        const fields = {
            id: req.params.id,
            devName: req.body.name,
        }
        try 
        {
            const c = await Device.findByPk(fields.id);
            if(!c)
                return res.status(404).send({error: "Device not found"});
            if(fields.devBane)
                await c.update({name :fields.devName});
            res.json("Entry was updated succesfully");
            
        }catch(error){
            res.status(500).json({error: "Error updating record"});
        }
    },
    
    getbyId: async (req, res) => {
        const id = req.params.id * 1;
        try{
            const c = await Device.findByPk(id);
            if(!c)
                return res.status(404).json({error: 'Device not found'});
            res.json(c);
        }catch(error){
            res.status(500).json({error: "Error getting device"});
        }
    
    },

    getbyName: async (req, res) =>{
        const devName = req.params.name;
        try{
            const c = await Device.findAll({
                where: {
                    name: devName,
                },
            });
            if(!c)
                return res.status(404).send("Device not found" || error);
            //const id = c[0].id;
            return res.json(c[0].id);

        }catch(error){
            res.status(500).send("Error getting device" || error);
        }
    },
    
    delete: async (req, res) => {
        const id = req.params.id * 1;
        try {
            const c = await Device.findByPk(id);
            if(!c)
                return res.status(404).json({error: 'Device not found'});
            
            await c.destroy();
            return res.json("Deleted entry");
    
            }catch (error){
            res.status(500).json({error: "Error deleting device"});
            }
        },

        deleteAll: async (req, res) => {
            try{
                const c = await Device.destroy({
                    truncate:true,
                })
                res.json("Devices where deleted succesfully");
            }catch(error){
                res.status(500).json({error: "Error deleting devices"});
            }
        }
};

module.exports = DeviceControl;