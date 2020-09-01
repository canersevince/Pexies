import {CacheInterceptor, Controller, Get, Req, UseInterceptors, CacheTTL} from '@nestjs/common';
import {Request} from "express";
import {DbService} from '../db/db.service';
import {PexelsService} from "../pexels/pexels.service";
import {FlickrService} from "../flickr/flickr.service";
import {UnsplashService} from "../unsplash/unsplash.service";
@Controller('search')
export class SearchController {
    constructor(
        private readonly DbService: DbService,
        private readonly PexelsService: PexelsService,
        private readonly FlickrService: FlickrService,
        private readonly UnsplashService: UnsplashService,
    ) {
    }
    @Get('/photos/:word/:page/:perPage/')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(6000)
    async searchPhoto(@Req() request: Request): Promise<{}> {
        console.log('caching search:',request.params.word)
        const tag = request.params.word
        const page = request.params.page
        const perPage = request.params.perPage
        if(!tag || !page || !perPage) {
            console.log('parameters not provided.')
            return false
        }
        console.log('searching for:', tag)
        await this.DbService.tagCollector(tag)
        const flickr = await this.FlickrService.searchByWord(tag, page, perPage)
        console.log('flickr', flickr.total)
        const unsplash = await this.UnsplashService.searchByWord(tag, page, perPage)
        console.log('unsplash', unsplash.total)
        const pexels = await this.PexelsService.searchByWord(tag, page, perPage)
        console.log('pexels', pexels.total_results)
        return {flickr, unsplash: unsplash, pexels, pexies:[]}
    }
}
