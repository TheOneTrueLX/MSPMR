export default function () {
    return {
        meta: {
            apiPrefix: '/api/v1'
        },
        data: [
            /* 
            {
                name: <service name>,
                uriMap: [ // array of URIs associated with the service
                    {
                        baseUri: <proxy_endpoint_uri>,
                        serviceUri: <url_to_service_endpoint>,
                    },
                ]
            }
            */
            {
                name: 'ioSocketService',
                uriMap: [
                    {
                        // TODO: evaluate if this is still needed once event bus is in place
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