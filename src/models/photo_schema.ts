export const photoSchema = {
    id: Number,
    width: Number,
    height: Number,
    url: String,
    liked: Boolean,
    photographer: String,
    photographer_url: String,
    photographer_id: String,
    description:String,
    tags: Array,
    created: Date,
    src: {
        original: String,
        large2x: String,
        large: String,
        medium: String,
        small: String,
        portrait: String,
        landscape: String,
        tiny: String,
    }
}
