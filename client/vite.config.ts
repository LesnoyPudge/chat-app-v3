import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompalible from 'vite-plugin-env-compatible';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { checker } from 'vite-plugin-checker';



// https://vitejs.dev/config/
export default defineConfig(() => {
    // const { CUSTOM_CLIENT_PORT } = process.env as unknown as IEnv;

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
            checker({ typescript: true }),
        ],
        envPrefix: 'CUSTOM_',
        server: {
            port: 3000,
        },
        // assetsInclude: ['assets/rawImages/**'],
    };
});