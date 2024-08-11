import { Injectable } from '@nestjs/common';
import { UserService } from '@src/api/user/user.service';
import { ProfilesService } from '@src/api/profiles/profiles.service';
import { User } from '@src/api/user/entities/user.entity';
import { PortfolioService } from '@src/api/portfolio/portfolio.service';
import { Profile } from '@src/api/profiles/entities/profile.entity';



@Injectable()
export class GenerateDataService {

    constructor(
        private readonly userService: UserService,
        private readonly profileService: ProfilesService,
        private readonly portfolioService: PortfolioService
    ) { }

    async generateUsers(numberOfUserToGenerate:number) {
        if(0 <= numberOfUserToGenerate) {
            return await this.userService.generateUsers(numberOfUserToGenerate);
        } else {
            throw new Error("Impossible to generate user");
        }  
    }

    async generateUserProfiles(numberOfProfileToGenerate:number) {
        if (0 <= numberOfProfileToGenerate) {
            const users:User[] = (await this.userService.getAllUsers()).data;
            if (users && numberOfProfileToGenerate <= users.length) {
                return await this.profileService.generateRandomUserProfiles(numberOfProfileToGenerate, users);
            }
        } else {
            throw new Error("Impossible to generate profiles");
        }        
    }


    async generateUserPortfolio(numberOfPortolioToGenerate:number) {
        if (0 <= numberOfPortolioToGenerate) {
            const userProfile:Profile[] = (await this.profileService.findAll()).data;
            if (userProfile && numberOfPortolioToGenerate <= userProfile.length) {
                return await this.portfolioService.generateRandomUserPortfolio(numberOfPortolioToGenerate, userProfile);
            }
        } else {
            throw new Error("Impossible to generate Portfolio");
        }        
    }
}
