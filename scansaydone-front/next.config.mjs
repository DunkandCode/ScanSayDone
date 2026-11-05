/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    sassOptions: {
        quietDeps: true,
        silenceDeprecations: [
            'import',
            'global-builtin',
            'color-functions',
            'if-function',
            'legacy-js-api'
        ]
    }
};

export default nextConfig;
