import { Controller, Get } from '@nestjs/common';
import { PollingService } from './polling.service';

@Controller('polling')
export class PollingController {
    constructor(private readonly pollingService: PollingService) { }

    @Get('order')
    async getLatestOrders() {
        return this.pollingService.getLatestOrders();
    }
}
