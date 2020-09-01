import { flickrPhoto } from '../../models/flickr-photo'
export default function (photo: flickrPhoto, size: string){
    // https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`
}
