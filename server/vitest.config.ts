import path from 'path';
import { defineConfig } from 'vitest/config';



export default defineConfig({
    resolve: {
        alias: {
            '@controllers': path.resolve(__dirname, 'src/controllers/index'),
            '@dtos': path.resolve(__dirname, 'src/dtos/index'),
            '@middlewares': path.resolve(__dirname, 'src/middlewares/index'),
            '@models/schemas': path.resolve(__dirname, 'src/models/schemas/index'),
            '@models': path.resolve(__dirname, 'src/models/index'),
            '@routes': path.resolve(__dirname, 'src/routes/index'),
            '@services': path.resolve(__dirname, 'src/services/index'),
            '@socket': path.resolve(__dirname, 'src/socket/index'),
            '@types': path.resolve(__dirname, 'src/types/index'),
            '@utils': path.resolve(__dirname, 'src/utils/index'),
            '@validators': path.resolve(__dirname, 'src/validators/index'),
            '@server': path.resolve(__dirname, 'src/server'),
            '@subscription/helpers': path.resolve(__dirname, 'src/subscription/subscriptionHelpers'),
            '@subscription': path.resolve(__dirname, 'src/subscription/index'),
            '@emails/components': path.resolve(__dirname, 'src/emails/components/index'),
            '@emails': path.resolve(__dirname, 'src/emails/index'),
            '@assets': path.resolve(__dirname, 'src/assets/index'),
        },
    },
});