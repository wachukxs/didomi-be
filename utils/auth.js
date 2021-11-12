const jwt = require('jsonwebtoken')
const db = require('../models')


module.exports.verifyJWT = (req, res, next) => {
    // Cookies that have not been signed
    // console.log('Cookies: ', req.cookies)
    // Cookies that have been signed
    // console.log('Signed Cookies: ', req.signedCookies)
    if (req.cookies._online) { // trying to access dashboard directly
        console.log('coming from', req.path);
        // console.log('\n\n req.session.corper is', req.session);
        // we could also use req.cookies, but req.signedCookies is just an extra layer of security
        jwt.verify(req.cookies._online, process.env.SESSION_SECRET, function(err, decodedToken) {
            if (err) {
                console.error(err);
                res.redirect('/login?e')
            } else if (helpers.statecodeFormat.test(req.path.substring(1)) && req.path !== '/' + decodedToken.statecode ) { // should we display a message asking them if they meant decodedToken.statecode ? or security flaw if we do that ?
                console.log('catching this err because:');
                res.status(502).redirect('/login?n=y') // [n]ot = [y]ou
            } else /* if (!req.session.corper) */ {

                /**
                 * TODO: res.locals or req.session ?
                 * 
                 * HOW COME PASSWORDS AREN"T hashed
                 */
                // console.log(Object.keys(PPA.rawAttributes)); // here lies a problem
                CorpMember.findOne({
                    where: { statecode: decodedToken.statecode.toUpperCase() },
                    // include: [{ all: true }],
                    include: [ // why is it looking for ppaId in PPA model ?? cause of bug in sequelize
                        Media,
                        {
                            model:PPA,
                            attributes: PPA.getAllActualAttributes() // hot fix (problem highlighted in ./models/ppa.js) -- > should create a PR to fix it ... related to https://github.com/sequelize/sequelize/issues/13309
                        },
                    ],
                    attributes: CorpMember.getSafeAttributes()
                })
                // query.AutoLogin(decodedToken.statecode)
                .then(result => {
                    // console.log('corper result object', result);
                    if (result) { // sometimes, it's null ...but why though ? // on sign up it's null ...
                        req.session.corper = result.dataValues;
                        next()
                    } else { // else what ?
                        throw new Error('Could not find corper')
                    }

                  }, reject => {
              
                    console.log('auth autologin catching this err because:', reject);
                    res.status(502).redirect('/login?t=a')
              
                  }).catch(reason => {
                    console.log('auth auto login catching this err because:', reason);
                    res.status(502).redirect('/login?t=a')
                  })
                //   .finally(() => {
                //       console.log('\nfinlly next?');
                //       // next() // very crucial
                //   })
            }
        })
    } else if (req.headers.referer && req.headers.referer.includes('/login') && req.headers['sec-fetch-site'] === 'same-origin') { // what does here do ? // if it's going to login page ...then we should remove the jwtVerify in 
        next()
    } else {
        res.redirect('/login')
    }
}