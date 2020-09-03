import {Photo} from "../../models/photo";
import {flickrPhoto} from "../../models/flickr-photo";
import FlickrUrlGenerator from "../../store/generators/flickr-url";

export default function formatter (data: any, word: string){
    const formatted: Photo[] = []
    if(!data.photo) return []
    data.photo.forEach((p: flickrPhoto) => {
        const newPhoto = new Photo()
        newPhoto.liked = false
        newPhoto.url = FlickrUrlGenerator(p, 'o')
        // tslint:disable-next-line
        newPhoto.photographer_url = `https://www.flickr.com/people/${p.owner}/`
        newPhoto.photographer = p.title
        newPhoto.src = {
            original: FlickrUrlGenerator(p, 'b'),
            large2x: FlickrUrlGenerator(p, 't'),
            large: FlickrUrlGenerator(p, 't'),
            small: FlickrUrlGenerator(p, 'n'),
            portrait: FlickrUrlGenerator(p, 'n'),
            landscape: FlickrUrlGenerator(p, 'c'),
            tiny: FlickrUrlGenerator(p, 's'),
            medium : FlickrUrlGenerator(p, 'n')
        }
        newPhoto.created = new Date()
        newPhoto.tags = word ? [word] : []
        formatted.push(newPhoto)
    })
    return formatted
}
