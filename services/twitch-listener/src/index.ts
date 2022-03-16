import { RefreshingAuthProvider, AccessToken } from '@twurple/auth';
import { ApiClient, HelixCustomReward } from '@twurple/api';
import { PubSubClient, PubSubListener, PubSubMessage, PubSubRedemptionMessage } from '@twurple/pubsub';
import { createClient } from 'node-redis';
import axios from 'axios';

import l from './logger';


async function main() {
    l.info('MSPMR Twitch PubSub listener service is starting...')
    
    // set up connection to redis
    const redisClient = createClient({ url: 'redis://redis:6380'});

    redisClient.on('error', (err) => {
        l.error('Could not connect to redis - terminating...')
        l.debug(err)
    })

    await redisClient.connect()
    
    // Sanity check - if oauth_tokens doesn't exist in redis, the end user hasn't done
    // the Twitch oauth2 circlejerk yet.  That needs to happen before starting this service.
    if(!await redisClient.exists('oauth_tokens')) {
        l.error('No oauth2 access token data found - terminating...');
        l.error('Log into your Twitch account from the management website before starting this service.');
        process.exit(1);
    }

    // Load authentication token data and refresh as needed
    const tokenData: AccessToken = JSON.parse(await redisClient.get('oauth_tokens'));
    const authProvider: RefreshingAuthProvider = new RefreshingAuthProvider({
        clientId: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        onRefresh: async newTokenData => await redisClient.set('oauth_tokens', newTokenData)
    }, tokenData)

    // Setup API connections
    const apiClient: ApiClient = new ApiClient({ authProvider });
    const pubSubClient: PubSubClient = new PubSubClient();
    const userId = await pubSubClient.registerUserListener(authProvider);

    // Create channel point reward for media share
    // TODO: probably should make some of these values configurable
    //       in .env at some point...
    const channelPointReward: HelixCustomReward = await apiClient.channelPoints.createCustomReward(userId, {
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
        if(redeem.rewardId === channelPointReward.id) {

            l.info(`Received media share redeem from ${redeem.userDisplayName}: ${redeem.message} [ID# ${redeem.id}]`);
            axios.post(`${process.env.API_URL}/videos`, redeem).then(() => {
                // API call succeeded
                l.info(`${redeem.id} submitted to API`);
            }).catch(function (err) {
                // API call failed
                l.error(`Failed to submit redeem ${redeem.id} - refunding points to user`);
                l.debug(err)
                apiClient.channelPoints.getRedemptionById(userId, redeem.rewardId, redeem.id).then((res) => {
                    res.updateStatus('CANCELED');
                })
            });
        }
    });
    
    l.info('MSPMR has started.');

    process.on('SIGTERM', async function (): Promise<void> {
        l.info('Received SIGINT - shutting down...');
        // Remove the PubSub subscription
        listener.remove();
        // Delete the channel point reward
        await apiClient.channelPoints.deleteCustomReward(userId, channelPointReward.id);
        // Close redis
        await redisClient.disconnect();
        l.info('Shutdown complete.');
    });
}

main();