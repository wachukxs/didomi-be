const db = require('../models')


module.exports = {
    async newNotificationEvent(req, res) {
        try {
            console.log('req.cookies', req.cookies);
            console.log('req.session', req.session);
            console.log('req.headers', req.headers);
            console.log('req.body in newNotificationEvent', req.body);

        db.Event.create({
            ...req.body.perference
            // emailNotifications: req.body.perference.emailNotifications,
            // smsNotifications: req.body.perference.smsNotifications,
            // userId: req.body.perference.userId,
            // userEmail: req.body.perference.userEmail,
        }).then((event) => {
                console.log('created new notification event', event.dataValues);
                res.json(event)
            })
            .catch((err) => {
                console.error('There was an error creating notification event', err)

                res.status(400).send(err)
            })
        } catch (error) {
            res.sendStatus(400)
        }
    },

}