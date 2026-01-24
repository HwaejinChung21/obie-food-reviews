import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // mobile apps / curl / Postman

      const allowed =
        origin === "http://localhost:19006" ||
        origin === "http://localhost:8081" ||
        /^https:\/\/obie-food-reviews\.expo\.app$/.test(origin);

      return allowed ? cb(null, true) : cb(new Error("Blocked by CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');

}
bootstrap();
