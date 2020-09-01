import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
const DotEnv = require('dotenv')
DotEnv.config()
global.fetch = fetch;
import Unsplash from 'unsplash-js';
// require syntax
const Unsplash = require('unsplash-js').default;
import { toJson } from "unsplash-js";
const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH });

@Injectable()
export class UnsplashService {
    async searchByWord(word, page, perPage){
        return unsplash.search.photos(word, page, perPage).then(toJson)
            .then(json => {
               return json
            })
    }
}
