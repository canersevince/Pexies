import {CacheInterceptor, Controller, Get, Req, UseInterceptors, CacheTTL} from '@nestjs/common';
import {Request} from "express";
import {DbService} from '../db/db.service';
import {PexelsService} from "../pexels/pexels.service";
import {FlickrService} from "../flickr/flickr.service";
import {UnsplashService} from "../unsplash/unsplash.service";
import {PhotoGeneratorsService} from "../photo-generators/photo-generators.service";

@Controller('search')
export class SearchController {
    constructor(
        private readonly DbService: DbService,
        private readonly PexelsService: PexelsService,
        private readonly FlickrService: FlickrService,
        private readonly UnsplashService: UnsplashService,
        private readonly PhotoGeneratorsService: PhotoGeneratorsService,
    ) {
    }

    @Get('/photos/:word/:page/:perPage/')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(6000)
    async searchPhoto(@Req() request: Request): Promise<{}> {
        console.log('caching search:', request.params.word)
        const tag = request.params.word
        const page: number = parseInt(request.params.page)
        const perPage = request.params.perPage
        if (!tag || !page || !perPage) {
            console.log('parameters not provided.')
            return false
        }
        console.log('searching for:', tag)
        await this.DbService.tagCollector(tag)
        const flickr = await this.FlickrService.searchByWord(tag, page, perPage)
        // const cacheFlickrArr = this.PhotoGeneratorsService.FlickrFormatter(flickr, tag)
        console.log('flickr', flickr.total)
        const unsplash = await this.UnsplashService.searchByWord(tag, page, perPage)
        // const cacheUnsplashArr = this.PhotoGeneratorsService.UnsplashFormatter(unsplash, tag)
        console.log('unsplash', unsplash.total)
        const pexels = await this.PexelsService.searchByWord(tag, page, perPage)
        console.log('pexels', pexels.total_results)
        const pexies = await this.DbService.getPhotosFromDB(tag, page, perPage)
        // const cachePexelsArr = this.PhotoGeneratorsService.PexelsFormatter(pexels, tag)
        // await this.DbService.cachePhotosFromSearch(cacheFlickrArr)
        // await this.DbService.cachePhotosFromSearch(cachePexelsArr)
        // await this.DbService.cachePhotosFromSearch(cacheUnsplashArr)
        return {flickr, unsplash: unsplash, pexels, pexies}
    }


    @Get('/photos/:word/:page/:perPage/:platform')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(6000)
    async getPage(@Req() req: Request): Promise<{}> {
        console.log('Searching...')
        const word = req.params.word
        const page = req.params.page
        const perPage = req.params.perPage
        const platform = req.params.platform
        switch (platform) {
            case "pexels":
                const pexelsArr = await this.PexelsService.searchByWord(word, page, perPage)
                // const cachePexelsArr = this.PhotoGeneratorsService.PexelsFormatter(pexelsArr, page)
                // await this.DbService.cachePhotosFromSearch(cachePexelsArr)
                return pexelsArr
            case "pexies":
                return []
            case "unsplash":
                const unplashArr = await this.UnsplashService.searchByWord(word, page, perPage)
                // const cacheUnsplashArr = this.PhotoGeneratorsService.UnsplashFormatter(unplashArr, page)
                // await this.DbService.cachePhotosFromSearch(cacheUnsplashArr)
                return unplashArr
            case "flickr":
                const flickrArr = await this.FlickrService.searchByWord(word, page, perPage)
                // const cacheFlickrArr = this.PhotoGeneratorsService.FlickrFormatter(flickrArr, page)
                // await this.DbService.cachePhotosFromSearch(cacheFlickrArr)
                return flickrArr
            default:
                return {error: "Error. Unrecognized platform."}
        }
    }

}
