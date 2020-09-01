import {Photo} from './photo'
export class User {
    username!: string
    name!: string
    surname!: string
    password!: string
    email!: string
    birthday!: string
    twitter!: string
    facebook!: string
    pexels!: string
    unsplash!: string
    deviantArt!: string
    preferences!: {
        showEmail: boolean;
        profile_cover: string;
        profile_picture: string;
        description: string;
    }
    created!: string
    followers!: User[]
    follows!: User[]
    favourites!: Photo[]
    interests!: string[]
}
