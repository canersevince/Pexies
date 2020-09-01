import {CacheInterceptor, CacheTTL, Controller, Get, Req, UseInterceptors} from '@nestjs/common';
import {Request} from "express";
import {FlickrService} from '../flickr/flickr.service'
@Controller('flicker-controller')
export class FlickerControllerController {
    constructor(private readonly FlickrService:FlickrService) {
    }

    @Get('/photos/flickr/recent')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(600)
    getFlickrRecent(@Req() request: Request): Promise<{}> {
        return this.FlickrService.getRecent$()
    }
}
