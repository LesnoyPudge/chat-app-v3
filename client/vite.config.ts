import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompalible from 'vite-plugin-env-compatible';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';



interface IEnv {
    CUSTOM_CLIENT_PORT: number;
}

// https://vitejs.dev/config/
export default defineConfig(() => {
    const { CUSTOM_CLIENT_PORT } = process.env as unknown as IEnv;

    return {
        plugins: [
            react(),
            envCompalible(),
            tsconfigPaths(),
            svgrPlugin({
                svgrOptions: {
                    icon: true,
                },
            }),
        ],
        envPrefix: 'CUSTOM_',
        server: {
            port: CUSTOM_CLIENT_PORT,
        },
        resolve: {
            alias: {
                // 'mixins': path.join(__dirname, 'src/root/styles/mixins'),
                // 'functions': path.join(__dirname, 'src/root/styles/functions'),
                // 'variables': path.join(__dirname, 'src/root/styles/variables'),
            },
        },
    };
});