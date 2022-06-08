export default function () {
    return {
        meta: {
            apiPrefix: '/api/v1'
        },
        data: [
            {
                name: 'testService',
                baseUri: '/test',
                method: 'get',
                serviceUri: 'https://localhost:3001/',
            }
        ]
    }
}