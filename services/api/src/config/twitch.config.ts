import { registerAs } from "@nestjs/config";

export default registerAs('twitch', () => ({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: process.env.TWITCH_CALLBACK_URL
}));