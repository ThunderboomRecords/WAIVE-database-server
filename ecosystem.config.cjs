module.exports = {
    apps: [
        {
            name: 'WAIVE-Sampler Database Server',
            script: '/usr/local/bin/node',
            args: 'index.js',
            env: {
                NODE_ENV: 'production',
                PORT: "3004",
                ADDRESS_HEADER: 'X-Forwarded-For',
                XFF_DEPTH: "1",
            }
        }
    ]
}
