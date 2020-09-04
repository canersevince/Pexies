import {Injectable, Logger} from '@nestjs/common';
import salt_generator from "../salt_generator";
import {FilterService} from '../filter/filter.service'
import {User} from "../models/user";
import {Photo} from "../models/photo";
import {Tag} from "../models/tag"
import {userSchema} from "../models/user_schema";
import {tagSchema} from "../models/tag_schema";
import {photoSchema} from "../models/photo_schema";

const Mongo = require('mongoose')
const DotEnv = require('dotenv')
const Crypto = require('crypto-js')
DotEnv.config()

const mongoLogin = process.env.mongo_server
Mongo.connect(mongoLogin, {useNewUrlParser: true});
const db = Mongo.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Successfully connected to mongo.')
});
const UserSchema = new Mongo.Schema(userSchema)
const TagSchema = new Mongo.Schema(tagSchema)
const PhotoSchema = new Mongo.Schema(photoSchema)
const userModel = Mongo.model('User', UserSchema)
const tagModel = Mongo.model('Tag', TagSchema)
const photoModel = Mongo.model('Photo', PhotoSchema)

@Injectable()
export class DbService {
    constructor(private FilterService: FilterService) {
    }

    /// sign in sign up
    async signUp(user) {
        const exists = await userModel.findOne({
            $or: [{
                email: user.email
            }, {
                username: { $regex : new RegExp(user.username, "i") }
            }]
        }).exec()
        if (!exists) {
            const registeredUser: User = JSON.parse(JSON.stringify(user))
            const salt = salt_generator(registeredUser.username.toLowerCase())
            registeredUser.password = Crypto.AES.encrypt(registeredUser.password, salt)
            registeredUser.created = new Date().toISOString()
            registeredUser.facebook = ""
            registeredUser.deviantArt = ""
            registeredUser.pexels = ""
            registeredUser.name = ""
            registeredUser.surname = ""
            registeredUser.preferences = {
                showEmail: false,
                description: "",
                profile_picture: "/default_picture.jpg",
                profile_cover: ""
            }
            const newUser = new userModel(registeredUser)
            return newUser.save();
        } else {
            return {
                error: "User already exists.",
                code: "exists"
            }
        }


    }
    async loginWithPassword(user) {
        let encrypted;
        let bytes;
        let decrypted;
        const logger = user.username.toLowerCase()
        const salt = salt_generator(logger)

        console.log(logger)
        const exists = await userModel.findOne({username: { $regex : new RegExp(logger, "i") }}, {favourites: {$slice: -40}})
        if (exists) {
            encrypted = exists.password
            bytes = Crypto.AES.decrypt(encrypted, salt)
            decrypted = bytes.toString(Crypto.enc.Utf8)
            if (decrypted == user.password) {
                const response = JSON.parse(JSON.stringify(exists))
                response.token = JSON.parse(JSON.stringify(response.password))
                delete response.password
                return response
            }
        }
        return {
            error: "User doesn't exist.",
            code: "not_found"
        }
    }
    async loginWithToken(user) {
        let encrypted;
        let bytes;
        let decrypted;
        const logger = user.username.toLowerCase()

        const salt = salt_generator(logger)
        const loggerBytes = Crypto.AES.decrypt(user.pexies_token, salt)
        const loggerPassword = loggerBytes.toString(Crypto.enc.Utf8)
        const exists = await userModel.findOne({username: { $regex : new RegExp(logger, "i") }})
        if (exists) {
            encrypted = exists.password
            bytes = Crypto.AES.decrypt(encrypted, salt)
            decrypted = bytes.toString(Crypto.enc.Utf8)
            if (decrypted == loggerPassword) {
                const response = JSON.parse(JSON.stringify(exists))
                response.token = JSON.parse(JSON.stringify(response.password))
                delete response.password
                return response
            }
        }
        return {
            error: "User doesn't exist.",
            code: "not_found"
        }
    }
    // finders
    async findUserByUsername(payload) {
        const exists = await userModel.findOne({username: payload.toLowerCase()}, {favourites: {$slice: -40}}).exec()
        if (exists as User) {
            delete exists.password
            delete exists.email
            return exists
        } else {
            return null
        }
    }
    async getFavsByPage({perPage, page, username}) {
        const favourites = await userModel.findOne({username:{ $regex : new RegExp(username, "i") }}, {favourites: {$slice: [page * (Math.abs(page)*-1), perPage]}})
        if (favourites) {
            return favourites
        }
        else return null
    }
    // interaction
    async favPhoto(payload) {
        const username = payload.username
        const photo = payload.photo
        const exists = await userModel.findOne({username}).exec()
        console.log(username)
        if (exists as User) {
            exists.favourites.push(photo)
            return exists.save()
        }
    }
    async removeFav(payload) {
        const username = payload.username
        const photo = payload.photo
        const exists = await userModel.findOne({username}).exec()
        if (exists as User) {
            exists.favourites = exists.favourites.filter(val => {
                return val.url !== photo.url
            })
            return exists.save()
        } else return null
    }
    // uploads and syncs
    async updateAvatar(user: User, payload) {
        const username = user
        const exists = await userModel.findOne({username: username}).exec()
        if (exists as User) {
            console.log('updating db..')
            exists.preferences.profile_picture = payload
            return exists.save()
        } else {
            return {
                error: "Couldn't save new profile picture."
            }
        }
    }
    async updateCover(user: User, payload) {
        const username = user
        const exists = await userModel.findOne({username: username}).exec()
        console.log(exists)
        if (exists as User) {
            console.log('updating db..')
            exists.preferences.profile_cover = payload
            return exists.save()
        } else {
            return {
                error: "Couldn't save new profile picture."
            }
        }
    }
    async syncFavs(clientFavs, username: string) {
        const exists = await userModel.findOne({username: username}).exec()
        console.log(username)
        if (exists as User) {
            const dbFavs: [] = exists.favourites.slice()
            var diffs = clientFavs.filter(function (obj: any) {
                return !dbFavs.some(function (obj2: any) {
                    return obj.url == obj2.url;
                });
            });
            exists.favourites = [...diffs, ...dbFavs]
            return exists.save()
        } else {
            return {
                error: "Couldn't save new profile picture."
            }
        }
    }
    async tagCollector(tag) {
        const exists = await tagModel.findOne({title: tag}).exec()
        if (exists) {
            exists.searchs++
            exists.save()
        } else {
            const clearWord = this.FilterService.clearWord(tag)
            if (!clearWord || tag !== clearWord) {
                console.log('Catched a bad word.')
                return
            }
            console.log('New tag saved.', clearWord)
            if(clearWord.length < 3) return
            const newTag = new tagModel({title: clearWord.toLowerCase(), searchs: 1})
            newTag.save()
        }
    }
    async tagGetter() {
        const tags = await tagModel.find( ).limit(50).sort( { searchs: 1} )
        return tags
    }
    async cachePhotosFromSearch(photos:Photo[]){
        if(photos && photos.length>0){
            for (const p of photos) {
              const newPhoto = {
                  url : p.url,
                  photographer : p.photographer,
                  photographer_url : p.photographer_url,
                  liked : p.liked,
                  src : p.src,
                  tags : p.tags,
                  photographer_id : p.photographer_id,
                  description : p.description,
                  height : p.height,
                  width : p.width,
                  id : parseInt(String(p.id)),
                  created : new Date(),
              }
                await photoModel.updateOne(
                    { url: p.url },
                    { $setOnInsert: { ...newPhoto} },
                    { upsert: true },
                ).exec()
            }
            console.log(`saved ${photos.length} items to database.`)
        }
    }
    async getPhotosFromDB (tags, page:number, perPage){
        console.log(tags)
        return await photoModel.find({tags: {$all: [...tags]}}).skip(page*(Math.abs(perPage))).limit(Math.abs(perPage)).exec();
    }
}
