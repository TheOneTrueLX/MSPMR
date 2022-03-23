import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IVideoModel {
  _id?: string;
  service_id: string;
  service: string;
  title?: string;
  duration?: number;
  copyrightClaimed?: boolean;
  redeemId?: number;
  submitter?: number;
  submissionDate?: number;
  played?: boolean;
};

const schema = new Schema({ // REF: https://developers.google.com/youtube/v3/docs/videos#resource
  service_id: String,  // submitted URL - maps to unique identifier for service
  service: String, // name of service
  title: String,  // video title
  duration: Number, // length of video in ms
  copyrightClaimed: Boolean, // only valid for YT
  redeemId: Number, // Twitch PubSub API - the ID of the channel point redeem
  submitter: String,  // Twitch PubSub API - username of user who redeemed the channel point reward
  submissionDate: Date, // Submission date in epoch
  played: Boolean, // Default false, gets set to true once the video is played
});

export const Video = mongoose.model<IVideoModel>("Video", schema);