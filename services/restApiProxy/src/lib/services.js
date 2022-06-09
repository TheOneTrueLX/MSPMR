export default function () {
    return {
        meta: {
            apiPrefix: '/api/v1'
        },
        data: [
            {
                name: 'authService',
                baseUri: '/auth',
                serviceUri: 'https://localhost:3001',
            }
        ]
    }
}