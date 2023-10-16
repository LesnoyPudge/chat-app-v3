import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompalible from 'vite-plugin-env-compatible';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { checker } from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';



// https://vitejs.dev/config/
export default defineConfig(() => {
    // const { CUSTOM_CLIENT_PORT } = process.env as unknown as IEnv;

    return {
        plugins: [
            react({
                babel: {
                    plugins: [
                        [
                            '@babel/plugin-transform-react-jsx',
                            { runtime: 'automatic' },
                        ],
                        'jsx-control-statements',
                    ],
                },
            }),
            envCompalible(),
            tsconfigPaths(),
            svgrPlugin({
                svgrOptions: {
                    icon: true,
                },
            }),
            checker({ typescript: true }),
            VitePWA({
                workbox: {
                    globPatterns: ['**/*'],
                },
                includeAssets: [
                    '**/*',
                ],
                manifest: {
                    'short_name': 'ChatApp',
                    'name': 'ChatApp by LesnoyPudge',
                    'icons': [
                        {
                            'src': '/android-chrome-192x192.png',
                            'sizes': '192x192',
                            'type': 'image/png',
                        },
                        {
                            'src': '/android-chrome-512x512.png',
                            'sizes': '512x512',
                            'type': 'image/png',
                        },
                    ],
                    'start_url': '.',
                    'display': 'standalone',
                    'theme_color': '#000000',
                    'background_color': '#000000',
                },
            }),
        ],
        envPrefix: 'CUSTOM_',
        server: {
            port: 3000,
        },
        preview: {
            port: 3000,
        },
        envDir: '..',
        build: {
            assetsInlineLimit: 0,
        },

        // assetsInclude: ['assets/**/*'],

    };
});