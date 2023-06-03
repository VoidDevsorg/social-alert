"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTube = void 0;
const node_events_1 = require("node:events");
const rssParser_1 = __importDefault(require("../../utils/rssParser"));
class YouTube extends node_events_1.EventEmitter {
    postedVideos;
    channels;
    constructor({ channels, postedVideos, interval }) {
        super();
        this.postedVideos = new Set(postedVideos);
        this.channels = new Set(channels);
        setInterval(() => {
            this._checkForNewVideos();
        }, interval);
        this.on('upload', (video) => {
            this.postedVideos.add(video.id);
        });
        return this;
    }
    addChannel(channel) {
        this.channels.add(channel);
    }
    removeChannel(channel) {
        this.channels = this.channels.delete(channel) ? this.channels : this.channels;
    }
    getChannels() {
        return this.channels;
    }
    getPostedVideos() {
        return this.postedVideos;
    }
    _newVideo(video) {
        console.log(Array.from(this.postedVideos));
        this.emit('upload', video);
    }
    async _checkForNewVideos() {
        for (const channel of this.channels) {
            const data = await (0, rssParser_1.default)(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`);
            const ch = data.feed.author[0].name[0];
            const video = data.feed.entry?.[0] || null;
            if (!video)
                return;
            const title = video.title[0];
            const link = video.link[0].$.href;
            const pubDate = video.published[0];
            const author = video.author[0].name[0];
            const id = video['yt:videoId'][0];
            const isoDate = video['published'][0];
            const thumbnail = video['media:group'][0]['media:thumbnail'][0].$.url;
            const description = video['media:group'][0]['media:description'][0];
            const videoData = {
                title,
                link,
                pubDate,
                author,
                id,
                isoDate,
                thumbnail,
                description
            };
            if (!this.postedVideos.has(id)) {
                this._newVideo(videoData);
            }
        }
    }
}
exports.YouTube = YouTube;
