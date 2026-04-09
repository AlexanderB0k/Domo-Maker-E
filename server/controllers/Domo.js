const models = require('../models');
const Domo = models.Domo;

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({ error: 'Name and age are required' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, age: newDomo.age});
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo with that name already exists' });
        }
        return res.status(500).json({ error: 'Error creating domo' });
    }
};

const makerPage = (req, res) => {
    res.render('app');
};

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age').lean().exec();
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
};