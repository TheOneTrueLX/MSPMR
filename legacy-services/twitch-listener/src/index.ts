import { RefreshingAuthProvider, AccessToken } from '@twurple/auth';
import { ApiClient, HelixCustomReward } from '@twurple/api';
import { PubSubClient, PubSubListener, PubSubMessage, PubSubRedemptionMessage } from '@twurple/pubsub';
import axios from 'axios';
import retry from 'retry';

import redisClient from './redis';
import l from './logger';

async function getOauthTokens(): Promise<AccessToken> {
    const operation = retry.operation({
        forever: true,
        factor: 1,
        minTimeout: 30000
    })

    return new Promise((resolve, reject) => {
        operation.attempt(async () => {
            l.info('Checking for Twitch oauth tokens...');
            const err = !await redisClient.exists('oauth_tokens') ? true : null;
            if (operation.retry(err)) {
                l.error('No Twitch oauth tokens found - authenticate with Twitch from the MSPMR frontend');
                return;
            }
            
            if(await redisClient.exists('oauth_tokens')) {
                l.info('oauth tokens found')
                resolve(JSON.parse(await redisClient.get('oauth_tokens')));
            } else {
                reject(operation.mainError());
            }
        })
    })
}

async function main() {
    l.info('MSPMR Twitch PubSub listener service is starting...')
    
    
    // Load authentication token data and refresh as needed
    // If oauth_tokens doesn't exist in redis, the end user hasn't done
    // the Twitch oauth2 circlejerk yet.  The service will wait indefinitely until
    // it sees that this has been done, then it will resume normal operation.
    const tokenData: AccessToken = await getOauthTokens();

    const authProvider: RefreshingAuthProvider = new RefreshingAuthProvider({
        clientId: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        onRefresh: async newTokenData => await redisClient.set('oauth_tokens', JSON.stringify(newTokenData))
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
    const listener: PubSubListener<PubSubMessage> = await pubSubClient.onRedemption(userId, async (redeem: PubSubRedemptionMessage) => {
        if(redeem.rewardId === channelPointReward.id) {

            try {
                l.info(`Received media share redeem from ${redeem.userDisplayName}: ${redeem.message} [ID# ${redeem.id}]`);

                // build payload for addition to the video queue
                const payload = {
                    redeem_id: redeem.id,
                    submitter: redeem.userDisplayName,
                    url: redeem.message
                }

                axios.post(`${process.env.API_URL}/videos`, payload).then(() => {
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
            } catch (err) {
                // an error occurred, so we need to refund the channel point redeem
                apiClient.channelPoints.getRedemptionById(userId, redeem.rewardId, redeem.id).then((res) => {
                    res.updateStatus('CANCELED');
                })
            }
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
        await redisClient.quit();
        l.info('Shutdown complete.');
    });
}

main();