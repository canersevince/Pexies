import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {
    apiStatus(): {} {
        return {
            message: "Hello there.",
            status: "online",
            version: "0.0.1"
        }
    }
}
