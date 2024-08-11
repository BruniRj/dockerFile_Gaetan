import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import './aliases';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './utils/exceptions/custom.exception.filter';

// enable application configuration
config();

// application startup function
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    app.useGlobalFilters(new CustomExceptionFilter()); // activation of the global exception filter

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    app.setGlobalPrefix('/api');

    // Activate data validations in DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: false,
            transform: true,
        }),
    );

    // activation of swagger
    const options = new DocumentBuilder() // create new document
        .setTitle('Talentio API') // title of document
        .setDescription('Web API for Talentio application.') // description du document
        .addBearerAuth() // add accessToken
        .setVersion('1.0') // document's version
        .build(); // building the document

    const document = SwaggerModule.createDocument(app, options); // creating the document
    SwaggerModule.setup('api/swagger', app, document); // activation of the document

    

    await app.listen(process.env.PORT || 3001);
}
bootstrap();
