import { Injectable } from '@nestjs/common';
import {Photo} from "../models/photo";

@Injectable()
export class PhotoGeneratorsService {
    FlickrUrlGenerator (photo: any, size: string){
        // https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
        return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`
    }
    FlickrFormatter (data: any, word: string){
        const formatted: Photo[] = []
        if(!data.photo) return []
        data.photo.forEach((p: any) => {
            const newPhoto = new Photo()
            newPhoto.id = p.id ? parseInt(p.id) : Math.ceil(Math.random()*421414414321)
            newPhoto.liked = false
            newPhoto.url = this.FlickrUrlGenerator(p, 'o')
            // tslint:disable-next-line
            newPhoto.photographer_url = `https://www.flickr.com/people/${p.owner}/`
            newPhoto.photographer = p.title
            newPhoto.src = {
                original: this.FlickrUrlGenerator(p, 'b'),
                large2x: this.FlickrUrlGenerator(p, 't'),
                large: this.FlickrUrlGenerator(p, 't'),
                small: this.FlickrUrlGenerator(p, 'n'),
                portrait: this.FlickrUrlGenerator(p, 'n'),
                landscape: this.FlickrUrlGenerator(p, 'c'),
                tiny: this.FlickrUrlGenerator(p, 's'),
                medium : this.FlickrUrlGenerator(p, 'n')
            }
            newPhoto.created = new Date()
            newPhoto.tags = word ? [word] : []
            formatted.push(newPhoto)
        })
        return formatted
    }
    UnsplashFormatter(imgs: any, word = null) {
        const return$ = [];
        imgs.results.forEach(img => {
            console.log(img.id? img.id : "")
            const newPhoto: Photo = {
                id: Math.ceil(Math.random()*241412421),
                width: img.width,
                height: img.height,
                url: img.urls.regular,
                liked: img.liked_by_user,
                photographer: img.user.name+ ' ' + img.user.last_name,
                photographer_url: 'https://unsplash.com/@'+img.user.username,
                photographer_id: img.user.id,
                tags: word ? [word, img.id] : [],
                description: img.description,
                created: new Date(img['created_at']),
                src: {
                    original: img.urls.raw,
                    large2x: img.urls.full,
                    large: img.urls.raw,
                    medium: img.urls.small,
                    small: img.urls.small,
                    portrait: img.urls.regular,
                    landscape: img.urls.full,
                    tiny: img.urls.thumb,
                }
            }
            return$.push(newPhoto)
        })
        return return$
    }
    PexelsFormatter(imgs: any, word = null) {
        const return$ = []
        imgs.photos.forEach(img => {
            img.id = img.id ?  parseInt(img.id) : Math.ceil(Math.random()*9999999999)
            img.tag = word
            img.word  = word ? [word] : []
            !img.description ? img.description = word : {}
            img.created = new Date()
            return$.push(img)
        })
        return return$
    }
}
