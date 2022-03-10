import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IVideoModel extends mongoose.Document {
  yt_id: string;
  title; string;
  duration: number;
  copyrightClaimed: boolean;
  redeemId: number;
  submitter: number;
};

const schema = new Schema({ // REF: https://developers.google.com/youtube/v3/docs/videos#resource
  yt_id: String,  // submitted URL - maps to "id"
  title: String,  // YT API - "snippet.localized.title"
  duration: Number, // YT API - derived from "contentDetails.duration" (ISO 8601)
  copyrightClaimed: Boolean, // YT API - "contentDetails.licensedContent"
  redeemId: Number, // Twitch PubSub API - the ID of the channel point redeem
  submitter: String,  // Twitch PubSub API - username of user who redeemed the channel point reward
});

export const Video = mongoose.model<IVideoModel>("Video", schema);