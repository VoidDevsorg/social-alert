import axios from 'axios';
import { EventEmitter } from 'node:events';
import { Client, Stream } from './types';

export class Twitch extends EventEmitter {
    public liveChannels: Set<string>;
    public channels: Set<string>;
    private client: Client;
    constructor({ channels, liveChannels, interval, client }: { channels: string[], liveChannels: string[], interval: number, client: Client }) {
        super();
        this.liveChannels = new Set(liveChannels);
        this.channels = new Set(channels);
        if (!client) throw new Error('No client provided');
        if (!client.id) throw new Error('No client id provided');
        if (!client.secret) throw new Error('No client secret provided');
        this.client = client;

        if (!client.token) {
            console.warn('No client token provided, fetching one now...');
            this.getToken().then((token) => token ? this.client.token = token : console.warn('Failed to fetch token.'));
        }

        setInterval(() => {
            this._checkForNewStreams();
        }, interval);

        return this;
    }

    public addChannel(channel: string) {
        console.log('Adding channel ' + channel);
        this.channels.add(channel);
    }

    public removeChannel(channel: string) {
        this.channels = this.channels.delete(channel) ? this.channels : this.channels;
    }

    public getChannels() {
        return this.channels;
    }

    public getLiveChannels() {
        return this.liveChannels;
    }

    private _newStream(stream: Stream) {
        if (!this.liveChannels.has(stream.user_login)) {
            this.liveChannels.add(stream.user_login);
            this.emit('live', stream);
        }
    }

    private _streamEnded(stream: Stream) {
        if (this.liveChannels.has(stream.user_login)) {
            this.liveChannels.delete(stream.user_login);
            this.emit('offline', stream);
        }
    }

    private async _checkForNewStreams() {
        for (const channel of this.channels) {
            const data = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
                headers: {
                    "client-id": this.client.id,
                    "Authorization": `Bearer ${this.client.token}`
                }
            }).then((res) => res.data).catch((err) => console.log(err));

            const stream = data.data?.[0] || null;
            if (!stream) continue;

            if (stream.type === 'live') this._newStream(stream);
            else this._streamEnded(stream);
        }
    }

    public async getToken() {
        const request = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: this.client.id,
            client_secret: this.client.secret,
            grant_type: 'client_credentials',
        }).catch(err => {
            return err.response;
        });

        const token = request?.data?.access_token ? request.data.access_token : null;
        console.log('(Twitch->getToken) New token created at ' + new Date().toLocaleString() + ' (' + token + ')');
        return token;
    }
}