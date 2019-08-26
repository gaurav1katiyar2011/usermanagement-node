const passport = require('passport')
const db = require('../sequelize')
const config = require('../config')
const JwtStrategy = require('passpaort-jwt').Stratery;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
    secretOrKey: config.secret
};

const jwtLogin = JwtStrategy(jwtOptions,function(payload, done){
    db.users.findAll({where: {user_id: payload.sub},include: [
        {model: db.groups ,include: [{model: db.tabs}]},{model: db.customers}
      ]
    }).then((user)=>{
        if(user) {done(null,user)} 
        else {done(null,false);}
    }).catch((err)=>{
        console.log(err)
        return done(err, false)
    })
})

passport.use(jwtLogin);
