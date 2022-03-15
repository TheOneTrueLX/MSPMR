import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { EventSubListener } from "@twurple/eventsub";
import { NgrokAdapter } from "@twurple/eventsub-ngrok"


export default class TwitchApiService {
    authProvider: ClientCredentialsAuthProvider
    apiClient: ApiClient
    eventSubListener: EventSubListener

    constructor() {
        this.authProvider = this.initTwitchAuthProvider()
        this.apiClient = this.initTwitchApiClient()
        this.eventSubListener = this.initEventSubListener()
    }

    initTwitchAuthProvider(): ClientCredentialsAuthProvider {
        return new ClientCredentialsAuthProvider(
            process.env.TWITCH_CLIENT_ID,
            process.env.TWITCH_CLIENT_SECRET
        );
    }

    initTwitchApiClient(): ApiClient {
        return new ApiClient({ authProvider: this.authProvider });
    }

    initEventSubListener(): EventSubListener {
        return new EventSubListener({
            apiClient: this.apiClient,
            adapter: new NgrokAdapter(),
            secret: process.env.SESSION_SECRET
        })
    }

    async listen(): Promise<void> {
        return await this.eventSubListener.listen();
    }
}
