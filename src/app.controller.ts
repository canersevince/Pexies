import {Controller, Get, Req} from '@nestjs/common';
import {AppService} from './app.service';
import {Request} from 'express';


@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('/api')
    getApi(@Req() request: Request): {} {
        return this.appService.apiStatus()
    }

    @Get('/api/photos/random')
    getRandom(@Req() request: Request): Promise<{}> {
        console.log('Request.')
        return this.appService.getRandom()
    }

    @Get('/api/photos/curated')
    getCurated(@Req() request: Request): Promise<{}> {
        console.log('curated')
        return this.appService.getCurated()
    }
}
