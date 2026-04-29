const {Alarm, Measurement} = require('../models/Association');

const AlarmControl = 
{
    getAll: async (req, res) => {
        try {
            const data = await Alarm.findAll({include : Measurement});
            res.json(data);

        } catch(error) {
            res.status(500).json({error: "Error getting device alarm data"});

        }
    },
    

    create: async (req, res) => {

        if(!req.body.status || !req.body.id){
            res.status(400).send({
                message: "Field can't be empty!"
            })
            return
        }

        const fields = {
            status: req.body.status,
            dataId: req.body.id
        }

        const dataM = await Measurement.findByPk(fields.dataId);

        if(!dataM){
            res.status(404).json({error: "Measurement not found"});
            return
        }

        Alarm.create({
            status: fields.status,
            measurement_id: fields.dataId
        })
            .then(data => {
                res.send(data || "/n Entry has been succesfully added");
            })
            .catch(error => {
                res.status(500).send(
                    error || "Error occurred when adding entry")
            })
    },

    //Update function for alarm, only value that can be edited by user is the status variable.
    update: async (req, res) => {
        const id = req.params.id;
        try 
        {
            const c = await Alarm.findByPk(id);
            if(!c)
                return res.status(404).send({error: "Alarm record not found"});
            const stat = req.body.status;
            if(stat)
                await c.update({status:stat})
            res.json("Entry was updated succesfully");
        }catch(error){
            res.status(500).json({error: "Error updating record"});
        }
    },
    

    getbyId: async (req, res) => {
        const id = req.params.id * 1;
        try{
            const c = await Alarm.findByPk(id);
            if(!c)
                return res.status(404).json({error: 'Alarm entry not found'});
            res.json(c);
        }catch(error){
            res.status(500).json({error: "Error getting alarm data"});
        }
    
    },
    
    delete: async (req, res) => {
        const id = req.params.id * 1;
        try {
            const c = await Alarm.findByPk(id);
            if(!c)
                return res.status(404).json({error: 'Alarm entry not found'});
            
            await c.destroy();
            return res.json("Deleted alarm entry");
    
            }catch (error){
            res.status(500).json({error: "Error deleting alarm entry"});
            }
        },
    
    deleteAll: async (req, res) => {
        try{
            const c = await Alarm.destroy({
                truncate:true,
            });
            res.json("Alarm entries where deleted succesfully");
        }catch(error){
            res.status(500).json({error: "Error deleting alarm entries"});
        }
    }
};

module.exports = AlarmControl;