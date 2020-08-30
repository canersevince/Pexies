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
    }
    created!: string
    followers!: []
    follows!: string[]
    favourites!: string[]
    interests!: string[]
}
