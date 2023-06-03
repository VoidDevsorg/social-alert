"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twitch = void 0;
const axios_1 = __importDefault(require("axios"));
const node_events_1 = require("node:events");
class Twitch extends node_events_1.EventEmitter {
    liveChannels;
    channels;
    client;
    constructor({ channels, liveChannels, interval, client }) {
        super();
        this.liveChannels = new Set(liveChannels);
        this.channels = new Set(channels);
        if (!client)
            throw new Error('No client provided');
        if (!client.id)
            throw new Error('No client id provided');
        if (!client.secret)
            throw new Error('No client secret provided');
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
    addChannel(channel) {
        console.log('Adding channel ' + channel);
        this.channels.add(channel);
    }
    removeChannel(channel) {
        this.channels = this.channels.delete(channel) ? this.channels : this.channels;
    }
    getChannels() {
        return this.channels;
    }
    getLiveChannels() {
        return this.liveChannels;
    }
    _newStream(stream) {
        if (!this.liveChannels.has(stream.user_login)) {
            this.liveChannels.add(stream.user_login);
            this.emit('live', stream);
        }
    }
    _streamEnded(stream) {
        if (this.liveChannels.has(stream.user_login)) {
            this.liveChannels.delete(stream.user_login);
            this.emit('offline', stream);
        }
    }
    async _checkForNewStreams() {
        for (const channel of this.channels) {
            const data = await axios_1.default.get(`https://api.twitch.tv/helix/streams?user_login=${channel}`, {
                headers: {
                    "client-id": this.client.id,
                    "Authorization": `Bearer ${this.client.token}`
                }
            }).then((res) => res.data).catch((err) => console.log(err));
            const stream = data.data?.[0] || null;
            if (!stream)
                return;
            if (stream.type === 'live')
                this._newStream(stream);
            else
                this._streamEnded(stream);
        }
    }
    async getToken() {
        const request = await axios_1.default.post('https://id.twitch.tv/oauth2/token', {
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
exports.Twitch = Twitch;
