import {Injectable} from '@nestjs/common';
import * as Axios from "axios"

const RandomWord = require('random-words')
var axios = Axios.default.create()

@Injectable()
export class AppService {
    apiStatus(): {} {
        return {
            message: "Hello there.",
            status: "online",
            version: "0.0.1"
        }
    }

    async getCurated(): Promise<any[]> {
        axios.defaults.headers.Authorization = process.env.pexels_api_key
        const {data} = await axios.get("https://api.pexels.com/v1/curated?per_page=100")
        if(data.photos.length>0){
            return data.photos
        }
    }

    async getRandom(): Promise<any[]> {
        axios.defaults.headers.Authorization = process.env.pexels_api_key
        let word = RandomWord()
        const {data} = await axios.get(`https://api.pexels.com/v1/search?query=${word}&per_page=100`)
        if(data.photos.length>25){
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
}
