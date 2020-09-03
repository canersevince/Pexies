import {Photo} from '../../models/photo'
export default function unsplashGenerator(img: any, word: any = null) {
    const newPhoto: Photo = {
        id: img.id,
        width: img.width,
        height: img.height,
        url: img.urls.regular,
        liked: img.liked_by_user,
        photographer: img.user.name+ ' ' + img.user.last_name,
        photographer_url: 'https://unsplash.com/@'+img.user.username,
        photographer_id: img.user.id,
        tags: word ? [word] : [],
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
    return newPhoto
}
