const DotEnv = require('dotenv')
DotEnv.config()
const saltKey = process.env.secret_salt
export default function (username){
    if(!saltKey){
        throw "salt key not found. check your .env file."
    }
    return username.substring(0, username.length-1) + '' + saltKey
}
