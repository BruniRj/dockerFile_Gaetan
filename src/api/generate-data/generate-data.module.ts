import { Module } from '@nestjs/common';
import { GenerateDataService } from '@src/api/generate-data/generate-data.service';
import { GenerateDataController } from '@src/api/generate-data/generate-data.controller';
import { UserModule } from '@src/api/user/user.module';
import { ProfilesModule } from '@src/api/profiles/profiles.module';
import { PortfolioModule } from '@src/api/portfolio/portfolio.module';

@Module({
  imports: [
    UserModule, ProfilesModule, PortfolioModule
  ],
  controllers: [GenerateDataController],
  providers: [GenerateDataService],
})
export class GenerateDataModule {}
