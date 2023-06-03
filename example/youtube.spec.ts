import { YouTube } from '../src';

const channels = [
    ''
];

const youtube = new YouTube({
    channels,
    postedVideos: [],
    interval: 10000
});

youtube.addChannel('');

youtube.on('upload', video => {
    console.log(video);
});