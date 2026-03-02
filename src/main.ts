import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita CORS para frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Debug middleware: log Authorization header for /api requests
  app.use((req: any, _res: any, next: any) => {
    try {
      if (typeof req.path === 'string' && req.path.startsWith('/api')) {
        console.log('🔍 Incoming request:', { method: req.method, path: req.path });
        console.log('🔐 Authorization header:', req.headers?.authorization);
        // Também decodifica o payload do JWT (sem verificar assinatura)
        try {
          const auth: string = req.headers?.authorization || '';
          if (auth.startsWith('Bearer ')) {
            const token = auth.slice(7);
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
              console.log('🔎 JWT payload (decoded, unverified):', payload);
            }
          }
        } catch (e) {
          console.warn('⚠️ Falha ao decodificar JWT no middleware:', e?.message || e);
        }
      }
    } catch (err) {
      console.error('Error in auth-debug middleware', err);
    }
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
