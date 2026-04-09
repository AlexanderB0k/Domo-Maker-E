const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    res.render('login');
}

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
}

const login = (req, res) => {
    const username = `${req.body.username}`;
    const password = `${req.body.password}`;

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    Account.authenticate(username, password, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/maker' });
    });
}

const signup = async (req, res) => {
    const username = `${req.body.username}`;
    const password = `${req.body.password}`;
    const password2 = `${req.body.password2}`;

    if (!username || !password || !password2) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== password2) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hash = await Account.generateHash(password);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.status(201).json({ message: 'Account created successfully' });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use' });
        }
        return res.status(500).json({ error: 'An error occurred while creating the account' });

    }


}

module.exports = {
    loginPage,
    logout,
    login,
    signup,
};