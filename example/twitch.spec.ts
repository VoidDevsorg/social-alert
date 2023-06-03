import { Twitch } from '../src';

const twitch = new Twitch({
    channels: [''],
    liveChannels: [],
    interval: 10000,
    client: {
        id: '',
        secret: '',
        token: ''
    }
});

twitch.addChannel('');

twitch.on('live', channel => {
    console.log(channel);
});

twitch.on('offline', channel => {
    console.log(channel);
});