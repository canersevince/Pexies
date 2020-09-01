import {Injectable} from '@nestjs/common';
import * as Axios from "axios";

var axios = Axios.default.create()
const Flickr = require('flickr-sdk')
const flickr = new Flickr(process.env.FLICKR_API_KEY)

@Injectable()
export class FlickrService {
    async getRecent$(): Promise<any[]> {
        const request = await flickr.photos.getRecent({per_page: 100})
        if(request.body.stat == 'ok'){
            return request.body.photos
        } else {
            console.log(request)
        }
        return []
    }
    async searchByWord(word, page, perPage) {
        console.log('Flickr search.', word)
        const request = await flickr.photos.search({accuracy: 1, safe_search: 1, page:page, per_page: perPage, text: word, tags: word})
        console.log(request.body)
        if(request.body.stat == 'ok'){
            return request.body.photos
        } else {
            console.log(request)
        }
        return []
    }
}
