import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompalible from 'vite-plugin-env-compatible';
import tsconfigPaths from 'vite-tsconfig-paths';
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import svgrPlugin from 'vite-plugin-svgr';



interface IEnv {
    CUSTOM_CLIENT_PORT: number;
}

// https://vitejs.dev/config/
export default defineConfig(() => {
    const { CUSTOM_CLIENT_PORT } = process.env as unknown as IEnv;

    return {
        envPrefix: 'CUSTOM_',
        server: {
            port: CUSTOM_CLIENT_PORT,
        },
        // optimizeDeps: {
        //     esbuildOptions: {
        //         define: {
        //             globalThis: 'globalThis',
        //         },
        //         plugins: [
        //             NodeGlobalsPolyfillPlugin({
        //                 buffer: true,
        //             }),
        //         ],
        //     },
        // },

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
    };
});