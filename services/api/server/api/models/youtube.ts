export interface IYoutubeCredentials {
    type: string;
    client_id: string;
    client_secret: string;
    redirect_url: string;
}

export interface IYoutubeResponse {
    kind: string;
    id: string;
    snippet: {
        title: string;
        thumbnails: {
            url: string;
        }
    }
}