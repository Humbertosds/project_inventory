import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index.routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { openApiDocument } from './config/openapi';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use('/api', router);

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/api-docs`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
