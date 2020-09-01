export const userSchema = {
    username: String,
    name: String,
    surname: String,
    password: String,
    email: String,
    birthday: String,
    twitter: String,
    facebook: String,
    pexels: String,
    unsplash: String,
    deviantArt: String,
    preferences: {
        showEmail: Boolean,
        profile_cover: String,
        profile_picture: String,
        description: String
    },
    created: Date,
    followers: Array,
    follows: Array,
    favourites: Array,
    interests: Array,
}
