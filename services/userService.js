const db = require('../models')


module.exports = {
    async signUpUser(req, res) {
        console.log('req.body in signUpUser', req.body);

        db.User.create(req.body)
            .then((user) => {
                console.log('created new user');
                res.json(user)
            })
            .catch((err) => {
                console.error('There was an error creating a user', err)
                
                res.status(400).send(err)
            })
    },

    async logInUser(req, res) {
        console.log('req.body in logInUser', req.body);

        db.User.findOne({
            where: {
                email: req.body.email
            }
        })
            .then((user) => {

                if (user && user.dataValues.password === req.body.password) {
                    console.log('logging in user', user);
                    res.json({...user})
                } else if (user) {
                    console.log('failed logging in user', user);
                    res.sendStatus(403) // Forbidden, we know you, but wrong password
                } else {
                    console.log('failed logging in user', user);
                    res.sendStatus(401) // Unauthorized, we don't know you
                }
                
            })
            .catch((err) => {
                console.error('There was an error creating a user', err)
                
                res.status(400).send(err)
            })
    },

    async getServiceReport(req, res) {

        res.json({ message: 'We done' })
    }
}