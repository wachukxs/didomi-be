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
                email: req.body.email.toLowerCase()
            }
        })
            .then((user) => {

                if (user && user.dataValues.password === req.body.password) {
                    console.log('logging in user', user);
                    res.json({ ...user })
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

    async getEventHistory(req, res) {
        try {
            // check if it's actually an email
            const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g

            if (emailRegEx.test(req.params.email)) {
                db.User.findOne({
                    where: {
                        email: req.params.email.toLowerCase()
                    },
                    attributes: { exclude: ['password'] },
                    include: [{
                        model: db.Event,
                        as: 'consents',
                        attributes: { exclude: ['userId'] }
                    }],
                }).then((user) => {

                    if (user) {
                        console.log('fetched events for user');
                        res.json(user)
                    } else {
                        console.log('failed to fetch events for user', user);
                        res.sendStatus(422)
                    }
    
                })
                .catch((err) => {
                    console.error('There was an error fetching events', err)
    
                    res.sendStatus(400)
                })
            } else {
                res.sendStatus(422)
            }
        } catch (error) {
            res.sendStatus(500)
        }

    }
}