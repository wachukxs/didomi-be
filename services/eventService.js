const db = require('../models')


module.exports = {
    async newNotificationEvent(req, res) {
        try {
            console.log('req.session.user', req.session);

        db.Event.create({
            ...req.body.perference
            // enabled: req.body.perference.enabled,
            // id: req.body.perference.id,
            // userId: req.perference.useId,
            // userEmail: req.perference.useEmail,
        }).then((event) => {
                console.log('created new notification event', event.dataValues);
                res.json(event)
            })
            .catch((err) => {
                console.error('There was an error creating notification event', err)

                res.status(400).send(err)
            })
        } catch (error) {
            console.log('err for ne even', error);
            res.sendStatus(400)
        }
    },

}