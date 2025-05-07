// seed-words.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { WordsService } from './src/words/words.service';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const wordsService = app.get(WordsService);

  const filePath = path.join(__dirname, 'words.txt');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').map(line => line.trim());

  for (const word of lines) {
    if (word.length === 5) {
      try {
        await wordsService.create({ word });
        console.log(`✅ Inserted: ${word}`);
      } catch (error) {
        console.log(`❌ Failed: ${word} - ${error.message}`);
      }
    } else {
      console.log(`⚠️ Skipped (not 5 letters): ${word}`);
    }
  }

  await app.close();
}
bootstrap();
