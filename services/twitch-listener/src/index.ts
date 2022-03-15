import { RefreshingAuthProvider, AccessToken } from '@twurple/auth';
import { ApiClient, HelixCustomReward } from '@twurple/api';
import { PubSubClient, PubSubListener, PubSubMessage, PubSubRedemptionMessage } from '@twurple/pubsub';

import { promises as fs } from 'fs';

import l from './logger';


async function main() {
    l.info('MSPMR Twitch PubSub listener service is starting...')
    // Load authentication token data and refresh as needed
    const tokenData: AccessToken = JSON.parse(await fs.readFile('./tokens.json', { encoding: 'utf-8' }));
    const authProvider: RefreshingAuthProvider = new RefreshingAuthProvider({
        clientId: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        onRefresh: async newTokenData => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'utf-8')
    }, tokenData)

    // Setup API connections
    const apiClient: ApiClient = new ApiClient({ authProvider });
    const pubSubClient: PubSubClient = new PubSubClient();
    const userId = await pubSubClient.registerUserListener(authProvider);

    // Create channel point redeem for media share
    const channelPointRedeem: HelixCustomReward = await apiClient.channelPoints.createCustomReward(userId, {
        autoFulfill: false,
        backgroundColor: '#b80000',
        cost: 1000,
        globalCooldown: 300,
        isEnabled: true,
        maxRedemptionsPerStream: null,
        maxRedemptionsPerUserPerStream: 5,
        prompt: 'Submit a video for media share.  Please paste the link to the YouTube video you want to see below.',
        title: '[MSPMR] Submit Video for Media Share',
        userInputRequired: true
    })

    // Subscribe to Twitch PubSub API listener for channel point redeems
    const listener: PubSubListener<PubSubMessage> = await pubSubClient.onRedemption(userId, (redeem: PubSubRedemptionMessage) => {
        if(redeem.rewardId === channelPointRedeem.id) {
            l.info(`Received media share redeem from ${redeem.userDisplayName}: ${redeem.message}`)
            /* TODO:
             *
             *  Submit an HTTP POST the redeem to http://api:5000/videos
             *  which will handle all of the post-processing for the redeem.
             * 
             *  This API endpoint will expect a PubSubRedemptionMessage object.
             *  
             */
        }
    })
    
    l.info('MSPMR has started.')

    process.on('SIGTERM', async function (): Promise<void> {
        l.info('Received SIGINT - shutting down...')
        // Remove the PubSub subscription
        listener.remove()
        // Delete the channel point redeem
        await apiClient.channelPoints.deleteCustomReward(userId, channelPointRedeem.id)
        l.info('Shutdown complete.')
    })
}

main();