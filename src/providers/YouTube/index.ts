import { Video } from './types';
import { EventEmitter } from 'node:events';
import rssParser from '../../utils/rssParser';

export class YouTube extends EventEmitter {
    public postedVideos: Set<string>;
    public channels: Set<string>;
    constructor({ channels, postedVideos, interval }: { channels: string[], postedVideos: string[], interval: number }) {
        super();
        this.postedVideos = new Set(postedVideos);
        this.channels = new Set(channels);

        setInterval(() => {
            this._checkForNewVideos();
        }, interval);

        this.on('upload', (video: Video) => {
            this.postedVideos.add(video.id);
        });

        return this;
    }

    public addChannel(channel: string) {
        this.channels.add(channel);
    }

    public removeChannel(channel: string) {
        this.channels = this.channels.delete(channel) ? this.channels : this.channels;
    }

    public getChannels() {
        return this.channels;
    }

    public getPostedVideos() {
        return this.postedVideos;
    }

    private _newVideo(video: Video) {
        console.log(Array.from(this.postedVideos));
        this.emit('upload', video);
    }

    private async _checkForNewVideos() {
        for (const channel of this.channels) {
            const data = await rssParser(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`);

            const ch = data.feed.author[0].name[0];
            const video = data.feed.entry?.[0] || null;

            if (!video) return;

            const title = video.title[0];
            const link = video.link[0].$.href;
            const pubDate = video.published[0];
            const author = video.author[0].name[0];
            const id = video['yt:videoId'][0];
            const isoDate = video['published'][0];
            const thumbnail = video['media:group'][0]['media:thumbnail'][0].$.url;
            const description = video['media:group'][0]['media:description'][0];

            const videoData: Video = {
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