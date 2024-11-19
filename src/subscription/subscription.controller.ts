import { Controller, Get, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService){}

    @Get('check')
    async checkChanges(@Query('collection') collection: string){
        if(!collection){
            return { error: 'Collection name is required' };
        }

        const changes = await this.subscriptionService.checkCollctionChanges(collection);

        if (changes.length === 0) {
            return { message: 'No changes detected'};
        }

        return { message: 'Changes detected', changes};
    }

}
