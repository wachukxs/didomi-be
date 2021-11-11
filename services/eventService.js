const db = require('../models')


module.exports = {
    async newNotificationEvent(req, res) {
        console.log('req.body in newNotificationEvent', req.body);

        db.Event.create({
            // userEmail: req.body.email,
            emailNotifications: req.body.consentoptions.email,
            smsNotifications: req.body.consentoptions.sms,
            userId: req.body.userid,
        }).then((event) => {
                console.log('created new notification event');
                res.json(event)
            })
            .catch((err) => {
                console.error('There was an error creating notification event', err)

                res.status(400).send(err)
            })
    },

}