![icon](https://voidapi.rest/images/bFQmP1j/social-alert.png)

# 

## Introduction

**Social Alert** package is a social media alert package that provides instant broadcast notification in applications such as Instagram and twitch.

With low latency, you can get information quickly when the broadcasts of the broadcasters start to broadcast, below is the user guide.

## Installation
```bash
npm i @voidpkg/social-alert --save 
# or
yarn add @voidpkg/social-alert 
```

<br><br>

# Usage

### **YouTube**
```ts
import { YouTube } from "@voidpkg/social-alert";

const youtube = new YouTube({
    channels: [ "CHANNEL_ID" ],
    postedVideos: [],
    interval: 10000
});

youtube.addChannel('CHANNEL_ID');

youtube.on('upload', (video: Video) => {
    console.log(video);
});
```

### **Twitch**
```ts
import { Twitch } from "@voidpkg/social-alert";

const twitch = new Twitch({
    channels: ['elraenn'],
    liveChannels: [],
    interval: 10000,
    client: {
        id: '', // Get from: https://dev.twitch.tv
        secret: '', // Get from: https://dev.twitch.tv
        token: '' // After entering the ID and SECRET, run it and check your console, a token will be automatically generated for you. So you can leave this blank.
    }
});

twitch.addChannel('wtcn');

twitch.on('live', (stream: Stream) => {
    console.log(channel);
});

twitch.on('offline', (stream: Stream)  => {
    console.log(channel);
});
```

<br><br>

# API

## Providers
|Name|Events|Implemented|Return Interface|Import Name|
|---|---|---|---|---|
|Twitch|`live`, `offline`|✅|`Stream`|`Twitch`|
|YouTube|`upload`|✅|`Video`|`YouTube`|
|Instagram|`-`|❌|`-`|`Instagram`|
|Reddit|`-`|❌|`-`|`Reddit`|
|Twitter|`-`|❌|`-`|`Twitter`|
|Game Discounts|`-`|❌|`-`|`GameDiscounts`|

<br>

## Interfaces

```ts
Stream {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    tags: string[];
    is_mature: boolean;
}

Video {
    title: string;
    link: string;
    pubDate: string;
    author: string;
    id: string;
    isoDate: string;
    thumbnail: string;
    description: string;
}
```

<br><br>

---
<br>
<div align="center">
    <p>© 2019 — 2023 <a href="https://voiddevs.org">Void Development, Ltd.</a> All rights reserved.</p>
</div>
