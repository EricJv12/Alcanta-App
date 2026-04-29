const {Measurement, Device} = require('../models/Association');

const MeasurementControl = 
{
    getAll: async (req, res) => {
        try {
            const data = await Measurement.findAll({include : Device});
            res.json(data);

        } catch(error) {
            res.status(500).json({error: "Error getting data"});

        }
    },

    create: async (req, res) => {
        if(!req.body.ph || !req.body.wlevel || !req.body.wflow && req.body.wflow !==0 || !req.body.id){
            res.status(400).send({
                message: "Field can't be empty!"
            })
            return
        }; 
    
        const fields = {
            ph: req.body.ph,
            wlevel: req.body.wlevel,
            wflow: req.body.wflow,
            devId: req.body.id
        }
        const device = await Device.findByPk(fields.devId);
        if(!device){
            res.status(404).json({error: "Device not found"});
            return
        }

        Measurement.create({
            ph: fields.ph,
            wlevel: fields.wlevel,
            wflow: fields.wflow,
            device_id: fields.devId,
        })
            .then(data => {
                res.send(data || "/n Entry has been succesfully added");
            })
            .catch(error => {
                res.status(500).send(error|| "Error occurred when adding entry to Measurements");
            })
    },


    getbyId: async (req, res) => {
        const id = req.params.id * 1;
        try{
            const c = await Measurement.findByPk(id);
            if(!c)
                return res.status(404).json({error: 'Data not found'});
            res.json(c);
        }catch(error){
            res.status(500).json({error: "Error getting data"});
        }
    
    },

    delete: async (req, res) => {
        const id = req.params.id * 1;
        try {
            const c = await Measurement.findByPk(id);
            if(!c)
                return res.status(404).json({error: 'Data not found'});
            
            await c.destroy();
            return res.json("Deleted data");
    
            }catch (error){
            res.status(500).json({error: "Error deleting data"});
                }
    },

    deleteAll: async (req, res) => {
        try{
            const c = await Measurement.destroy({
                truncate:true,
            });
            res.json("All data was deleted succesfully");
        }catch(error){
            res.status(500).json({error: "Error deleting data entries"});
        }
    }
};


module.exports = MeasurementControl;