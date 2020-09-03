import { Injectable } from '@nestjs/common';
const DotEnv = require('dotenv')
import Axios from 'axios'
DotEnv.config()
const axios = Axios.create()
axios.defaults.headers['api-key'] = "6f7dcccf-a7bc-4f2e-b2f1-6307e01b4b51"
axios.defaults.headers['content-type'] = "application/x-www-form-urlencoded"

@Injectable()
export class NudityDetectionService {
    api = process.env.NUDITY_DETECTOR
    async checkNudity(url){
        console.log(url)
        const apiUrl = `https://api.deepai.org/api/nsfw-detector`;
        return axios.post(apiUrl, 'image='+url);
    }
}
