require('dotenv').config();

const auth = req => {
    return req.headers.authorization === 'Bearer '+process.env.API_KEY ? true : false
}

module.exports = auth;