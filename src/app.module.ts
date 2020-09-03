import {Module, CacheModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path'; // New
import { DbService } from './db/db.service';
import { FlickrService } from './flickr/flickr.service';
import { PexelsService } from './pexels/pexels.service';
import { AwsService } from './aws/aws.service';
import { FilterService } from './filter/filter.service';
import { UnsplashService } from './unsplash/unsplash.service';
import { SearchController } from './search/search.controller';
import { PexelsControllerController } from './pexels-controller/pexels-controller.controller';
import { PexiesController } from './pexies/pexies.controller';
import { FlickerControllerController } from './flicker-controller/flicker-controller.controller';
import { NudityDetectionService } from './nudity-detection/nudity-detection.service';
import { PhotoGeneratorsService } from './photo-generators/photo-generators.service';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../../', 'client/dist')
        }),
        CacheModule.register()
    ],
    controllers: [AppController, SearchController, PexelsControllerController, PexiesController, FlickerControllerController],
    providers: [AppService, DbService, FlickrService, PexelsService, AwsService, FilterService, UnsplashService, NudityDetectionService, PhotoGeneratorsService],
})
export class AppModule {
}
