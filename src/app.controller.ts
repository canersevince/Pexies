import {Controller, Get, Req, Post, UseInterceptors, UploadedFile, CacheInterceptor, CacheTTL} from '@nestjs/common';
import {AppService} from './app.service';
import {DbService} from './db/db.service';
import {PexelsService} from "./pexels/pexels.service";
import {FlickrService} from "./flickr/flickr.service";
import {Request} from 'express';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly  DbService: DbService) {
    }

    @Get('/')
    getApi(@Req() request: Request): {} {
        return this.appService.apiStatus()
    }

    @Get('/tags/get')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(600)
    getTags(@Req() request: Request): {} {
        return this.DbService.tagGetter()
    }



}
