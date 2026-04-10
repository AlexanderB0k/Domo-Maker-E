const models = require('../models');
const Domo = models.Domo;

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.animal) {
        return res.status(400).json({ error: 'Name, age, and animal are required' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        animal: req.body.animal,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, animal: newDomo.animal, _id: newDomo._id });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo with that name already exists' });
        }
        return res.status(500).json({ error: 'Error creating domo' });
    }
};

const deleteDomo = async (req, res) => {
    try {
        const domoId = req.params.id;

        const deleted = await Domo.deleteOne({
            _id: domoId,
            owner: req.session.account._id,
        });

        if (deleted.deletedCount === 0) {
            return res.status(404).json({ error: 'Domo not found' });
        }

        return res.status(200).json({ message: 'Domo deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error deleting domo' });
    }
};

const makerPage = (req, res) => {
    res.render('app');
};

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age animal _id').lean().exec();
        return res.json({ domos: docs });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching domos' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    getDomos,
    deleteDomo,
};