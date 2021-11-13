const db = require('../models')
const jwt = require('jsonwebtoken')


/**
 * options for setting JWT cookies
 * 
 * */
let cookieOptions = {
    httpOnly: true, // frontend js can't access
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    // sameSite: 'strict', // https://github.com/expressjs/session/issues/660#issuecomment-514384297
    // path: '' // until we figure out how to add multiple path
}

if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true // localhost, too, won't work if true
}

module.exports = {
    async signUpUser(req, res) {
        console.log('req.body in signUpUser', req.body);

        try {
            db.User.create(req.body)
                .then((user) => {
                    console.log('created new user');

                    // send welcome email
                    jwt.sign({
                        email: req.body.email.toLowerCase()
                    }, process.env.SESSION_SECRET, (err, token) => {
                        if (err) {
                            console.error('sign up err', err)
                            res.sendStatus(400)
                        } else {
                            console.log('\n\n\n\nsigned up ...done jwt and', req.session);
                            
                            // req.session.user = user.dataValues
                            res.cookie('_didomi_fe', token, cookieOptions)

                            console.log('we\'re moving sing up', req.session);
                            res.json(user)
                        }
                    })
                })
                .catch((err) => {
                    console.error('There was an error creating a user', err)
                    let { errors, fields } = err
                    if (errors[0].validatorKey == 'is_null' && errors[0].path == 'email') {
                        res.sendStatus(422)
                    } else {
                        res.status(400).send({ errors, fields })
                    }
                    
                })
        } catch (error) {
            res.status(400)
        }
    },

    async logInUser(req, res) {
        console.log('req.body in logInUser', req.body);

        db.User.findOne({
            where: {
                email: req.body.email.toLowerCase()
            },
            attributes: { exclude: ['password'] }, // comment if we'll check passwords
            include: [{
                model: db.Event,
                as: 'consents',
                attributes: { exclude: ['userId'] } // will include userEmail
            }],
        }).then((user) => {

            // if (user && user.dataValues.password === req.body.password) {
            //     console.log('logging in user');
            //     res.json(user)
            // } else if (user) {
            //     console.log('failed logging in user', user);
            //     res.sendStatus(403) // Forbidden, we know you, but wrong password
            // } else {
            //     console.log('failed logging in user', user);
            //     res.sendStatus(401) // Unauthorized, we don't know you
            // }

            if (user) {
                console.log('logging in user', user.dataValues.email);


                jwt.sign({
                    email: user.dataValues.email
                }, process.env.SESSION_SECRET, (err, token) => {
                    if (err) {
                        res.sendStatus(400)
                    } else {
                        // req.session.user = user.dataValues
                        res.cookie('_didomi_fe', token, cookieOptions)
                        console.log('we\'re moving login', req.session);
                        /* req.session.save(function(err) { // maybe do this before every server restart
                          console.log("saved session");
                        }) */
                        res.json(user)
                    }
                })

            } else {
                console.log('failed logging in user', user);
                res.sendStatus(422)
            }

        }).catch((err) => {
            console.error('There was an error creating a user', err)

            res.status(400).send(err)
        })
    },

    async getEventHistory(req, res) {
        try {
            console.log('getEventHistory');
            console.log('req.cookies', req.cookies);
            console.log('req.session', req.session);
            console.log('req.headers', req.headers);
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
                        attributes: { exclude: ['userId'] } // will include userEmail
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

    },

    async deleteUser(req, res) {
        // should be an email, and should already exist ... what happens if we try to delete an entry that didn't exist ?
        // you can't delete an entry if you aren't authenticated

        console.log('deleting', req.params.email);
        db.User.destroy({
            where: {
                email: req.params.email
            }
        }).then((user) => {
            console.log('deletedddd', user);
            if (user) { // means the user exists, and we deleted them
                res.json({ message: "Account successfuly deleted" })
            } else {
                res.sendStatus(422)
            }

        })
            .catch((err) => {
                console.error('There was an error deleting user', err)

                res.sendStatus(400)
            })


    },

    async logOutUser(req, res) {
        try {
            req.session.destroy(function (err) {
                if (err) {
                    req.sendStatus(400)
                } else {
                    // cannot access session here
                    console.log('session destroyed');
                    res.cookie('_didomi_fe', '', { // clear the JWT value
                        maxAge: 1 // remove the JWT ASAP
                    })
                    res.json({ message: 'Bye.' });
                }
            });
        } catch (error) {

        }
    }
}