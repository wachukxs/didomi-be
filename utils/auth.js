const jwt = require('jsonwebtoken')
const db = require('../models')


module.exports.verifyJWT = (req, res, next) => {

    try {

        if (req.cookies && req.cookies._didomi_fe) { //
            
            // console.log('\n\n req.session.corper is', req.session);
            
            // we could also use req.cookies, but req.signedCookies is just an extra layer of security
            jwt.verify(req.cookies._didomi_fe, process.env.SESSION_SECRET , function(err, decodedToken) {
                if (err) {
                    console.error(err);
                    res.sendStatus(400)
                } else if (req.params.email === decodedToken.email) {
                    console.log('catching this err because:');
                    next()
                } else {
                    res.sendStatus(422)
                }
            })
        } else {
            res.sendStatus(422)
        }
    } catch (error) {
        console.error('caught err:', error);
        res.sendStatus(422)
    }
}