export default function () {
    return {
        meta: {
            apiPrefix: '/api/v1'
        },
        data: [
            {
                name: 'ioSocketService',
                uriMap: [
                    {
                        baseUri: '/socket',
                        serviceUri: 'https://localhost:3001'
                    },
                    {
                        baseUri: '/socket.io',
                        serviceUri: 'https://localhost:3001/socket.io'
                    }
                ],
            },
            {
                name: 'authService',
                uriMap: [
                    {
                        baseUri: '/auth',
                        serviceUri: 'https://localhost:3002',
        
                    }
                ]
            },
            {
                name: 'channelService',
                uriMap: [
                    {
                        baseUri: '/channel',
                        serviceUri: 'https://localhost:3003',        
                    }
                ]
            },
            {
                name: 'videoService',
                uriMap: [
                    {
                        baseUri: '/video',
                        serviceUri: 'https://localhost:3004',        
                    }
                ]
            },
            {
                name: 'ytPostProcessorService',
                uriMap: [
                    {
                        baseUri: '/youtube',
                        serviceUri: 'https://localhost:3005',        
                    }
                ]
            },
        ]
    }
}