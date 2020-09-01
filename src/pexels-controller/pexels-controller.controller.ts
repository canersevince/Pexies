import {CacheInterceptor, CacheTTL, Controller, Get, Req, UseInterceptors} from '@nestjs/common';
import {Request} from "express";
import {PexelsService} from '../pexels/pexels.service'

@Controller('')
export class PexelsControllerController {
    constructor(
        private PexelsService: PexelsService
    ) {}

    @Get('/photos/pexels/random')
    getRandom(@Req() request: Request): Promise<{}> {
        return this.PexelsService.getRandom()
    }

    @Get('/photos/pexels/curated')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(6000)
    getCurated(@Req() request: Request): Promise<{}> {
        return this.PexelsService.getCurated()
    }
}
