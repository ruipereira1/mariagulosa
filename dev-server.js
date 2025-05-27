// Servidor de desenvolvimento para APIs do Firebase
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carregar variáveis de ambiente do .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Log das variáveis de ambiente do Firebase
console.log('🔧 Firebase Environment Variables:');
console.log('  FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('  FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('  NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');

// Importar as APIs
import manageCakesHandler from './api/manage-cakes.js';
import ordersHandler from './api/orders.js';
import statsHandler from './api/stats.js';
import updateOrderHandler from './api/update-order.js';
import resetOrdersHandler from './api/reset-orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Log das requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Wrapper para converter handlers do Vercel para Express
const wrapVercelHandler = (handler) => {
  return async (req, res) => {
    try {
      // Simular o objeto de request/response do Vercel
      const vercelReq = {
        method: req.method,
        body: req.body,
        query: req.query,
        headers: req.headers
      };
      
      const vercelRes = {
        status: (code) => {
          res.status(code);
          return vercelRes;
        },
        json: (data) => {
          res.json(data);
          return vercelRes;
        },
        send: (data) => {
          res.send(data);
          return vercelRes;
        },
        setHeader: (name, value) => {
          res.setHeader(name, value);
          return vercelRes;
        },
        end: (data) => {
          if (data) {
            res.send(data);
          } else {
            res.end();
          }
          return vercelRes;
        }
      };
      
      await handler(vercelReq, vercelRes);
    } catch (error) {
      console.error('Error in API handler:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Internal server error' 
      });
    }
  };
};

// Rotas da API
app.all('/api/manage-cakes', wrapVercelHandler(manageCakesHandler));
app.all('/api/orders', wrapVercelHandler(ordersHandler));
app.all('/api/stats', wrapVercelHandler(statsHandler));
app.all('/api/update-order', wrapVercelHandler(updateOrderHandler));
app.all('/api/reset-orders', wrapVercelHandler(resetOrdersHandler));

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Dev server is running!',
    timestamp: new Date().toISOString(),
    firebase: {
      hasApiKey: !!process.env.FIREBASE_API_KEY || !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID || !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Dev server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available:`);
  console.log(`   - GET  /api/stats`);
  console.log(`   - GET  /api/orders`);
  console.log(`   - GET  /api/manage-cakes`);
  console.log(`   - POST /api/manage-cakes`);
  console.log(`   - PUT  /api/manage-cakes`);
  console.log(`   - DELETE /api/manage-cakes`);
  console.log(`   - PUT  /api/update-order`);
  console.log(`   - POST /api/reset-orders`);
  console.log(`🔥 Using Firebase for data storage`);
}); 