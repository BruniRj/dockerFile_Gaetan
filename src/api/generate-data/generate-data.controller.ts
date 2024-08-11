import { Controller, Get, Param, UseGuards, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { GenerateDataService } from '@src/api/generate-data/generate-data.service';
import { Public } from '@src/api/user/decorator/public.decorator';
import { ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '@src/api/common/guards/api-key/api-key.guard';


@Controller('generate-data')
@ApiTags('Somes features to generate data')
@UseInterceptors(ClassSerializerInterceptor)
export class GenerateDataController {

    constructor(
        private readonly generateDataService: GenerateDataService
    ) { }

    @Public()
    @UseGuards(ApiKeyGuard)
    @ApiOperation({
        summary: 'Generate some Users'
    })
    @ApiHeader({
        name: 'x-api-key',
        description: 'Super Admin api key',
    })
    @ApiParam({
        name: 'count',
        required: true,
        description: "Number of the User to generate",
        type: Number,
    })
    @Get('user/:count')
    async generateSomeUser(@Param('count') countUser: number) {
        return await this.generateDataService.generateUsers(countUser);
    }


    @Public()
    @UseGuards(ApiKeyGuard)
    @ApiOperation({
        summary: "Generate some of User's Profile"
    })
    @ApiHeader({
        name: 'x-api-key',
        description: 'Super Admin api key',
    })
    @ApiParam({
        name: 'count',
        required: true,
        description: "Number of the User's Profile to generate",
        type: Number,
    })
    @Get('profile/:count')
    async generateSomeProfile(@Param('count') countProfile: number) {
        return await this.generateDataService.generateUserProfiles(countProfile);
    }


    @Public()
    @UseGuards(ApiKeyGuard)
    @ApiOperation({
        summary: "Generate some of User's Portfolio"
    })
    @ApiHeader({
        name: 'x-api-key',
        description: 'Super Admin api key',
    })
    @ApiParam({
        name: 'count',
        required: true,
        description: "Number of the User's Portfolio to generate",
        type: Number,
    })
    @Get('portfolio/:count')
    async generateSomePortfolio(@Param('count') countPortfolio: number) {
        return await this.generateDataService.generateUserPortfolio(countPortfolio);
    }

}
