import {CacheInterceptor, CacheTTL, Controller, Get, Post, Req, UploadedFile, UseInterceptors,} from '@nestjs/common';
import {Request} from "express";
import {AwsService} from '../aws/aws.service';
import {DbService} from '../db/db.service';
import {UnsplashService} from '../unsplash/unsplash.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {PhotoGeneratorsService} from '../photo-generators/photo-generators.service'

@Controller('')
export class PexiesController {
    constructor(
        private readonly AwsService: AwsService,
        private readonly PhotoGeneratorService: PhotoGeneratorsService,
        private readonly DbService: DbService,
        private readonly UnsplashService: UnsplashService,
    ) {
    }

    @Post('/user/signup')
    signUp(@Req() request: Request): {} {
        return this.DbService.signUp(request.body)
    }

    @Post('/user/login')
    login(@Req() request: Request): {} {
        console.log(request.body)
        return this.DbService.loginWithPassword(request.body)
    }

    @Post('/user/login_token')
    login_token(@Req() request: Request): {} {
        return this.DbService.loginWithToken(request.body)
    }

    // activities
    @Post('/user/upload-profile-picture')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@Req() request: Request, @UploadedFile() file): Promise<any> {
        const avatar = file;
        const user = request.headers["username"]
        const oldAvatar = request.headers["current_avatar"]
        const data = await this.AwsService.uploadAvatar(avatar, avatar.originalname, user, oldAvatar)
        if (data.Location) return {data: "Profile picture updated.", code: 200, url: data.Location}
        else return {
            error: "There was en error while uploading profile picture. Does is contain nudity? :)",
            code: 500,
        }
    }

    @Post('/user/upload-cover-picture')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCover(@Req() request: Request, @UploadedFile() file): Promise<any> {
        const avatar = file;
        const user = request.headers["username"];
        const oldAvatar = request.headers["current_header"];
        const data = await this.AwsService.uploadCover(avatar, avatar.originalname, user, oldAvatar)
        if (data.Location) return {data: "Cover image updated.", code: 200, url: data.Location}
        else return {
            error: "There was en error while uploading profile picture. Does it contain nudity? :)",
            code: 500,
        }
    }

    @Get('/user/getbyusername/:username')
    getByUsername(@Req() request: Request): {} {
        const username = request.params.username
        console.log(username)
        return this.DbService.findUserByUsername(username)
    }

    @Post('/user/favourite')
    async favourite(@Req() request: Request): Promise<{}> {
        const data = await this.DbService.favPhoto(request.body)
        if (data) {
            return {code: 200}
        }
        return false
    }

    @Post('/user/unfav')
    async unfavourite(@Req() request: Request): Promise<{}> {
        const data = await this.DbService.removeFav(request.body)
        if (data) {
            return {code: 200}
        }
        return false
    }

    @Post('/user/sync_favourites')
    syncFavs(@Req() request: Request): {} {
        const username: string = request.headers["username"].toString()
        return this.DbService.syncFavs(request.body, username)
    }

    @Get('/favourites/:perPage/:page/:username')
    getFavourites(@Req() request: Request): {} {
        const params = {
            username: request.params.username,
            perPage: request.params.perPage,
            page: request.params.page
        }
        return this.DbService.getFavsByPage(params)
    }

    @Post('/user/dashboard/')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300)
    async getDashboardRandom(@Req() request: Request): Promise<{}> {
        const tags = request.body.tags
        console.log(tags)
        if (tags && tags.length > 0) {
            // get specific photos db
        }
        const p = await this.UnsplashService.getRandom()
        return {
            unsplash: p
        }
    }

    @Post('/user/dashboard/:tag')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(300)
    async getDashboard(@Req() request: Request): Promise<{}> {
        const tags = request.params.tag
        const userTags = request.body.tags
        console.log('user tags', userTags)
        let imagesByTags;
        let randoms;
        if (tags && tags.length > 0) {
            imagesByTags = await this.DbService.getPhotosFromDB(Array.isArray(userTags) ? userTags : [userTags], 1, 24)
            console.log(imagesByTags)
        }
        if (imagesByTags.length == 0) {
            randoms = await this.UnsplashService.searchByWord(tags, Math.ceil(Math.random() * 20), 24)
            return {unsplash : randoms.results}
        }
        return [...imagesByTags]
    }
}
