export class Photo {
    id!: number
    width!: number
    height!: number
    url!: string
    liked!: boolean
    photographer!: string
    photographer_url!: string
    photographer_id!: any
    description!:string
    tags!:string[]
    created!: Date
    src!: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    }
}
