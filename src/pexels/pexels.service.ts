import { Injectable } from '@nestjs/common';
import * as Axios from "axios";
var axios = Axios.default.create()
const RandomWord = require('random-words')
const DotEnv = require('dotenv')
DotEnv.config()
@Injectable()
export class PexelsService {
    async getCurated(): Promise<any[]> {
        axios.defaults.headers.Authorization = process.env.pexels_api_key
        const {data} = await axios.get("https://api.pexels.com/v1/curated?per_page=100")
        if(data.photos.length>0){
            return data.photos
        } else return []
    }

    async getRandom(): Promise<any[]> {
        axios.defaults.headers.Authorization = process.env.pexels_api_key
        let word = RandomWord()
        const {data} = await axios.get(`https://api.pexels.com/v1/search?query=${word}&per_page=100`)
        if(data.photos.length>40){
            return data
        } else {
            let nextTick = await this.getRandom()
            if(nextTick.length>0){
                data.photos = [...data.photos, ...nextTick]
                return data.photos
            } else {
                return this.getRandom()
            }
        }
    }

    async searchByWord(word, page, perPage){
        const link =  `https://api.pexels.com/v1/search?query=${word}&per_page=${perPage}&page=${page}`
        axios.defaults.headers['Authorization'] = process.env.pexels_api_key
        const {data} = await axios.get(link)
        return data
    }
}
