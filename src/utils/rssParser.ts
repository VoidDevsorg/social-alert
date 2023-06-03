import axios from 'axios';
import { parseString } from 'xml2js';

export default async function rssParser(url: string): Promise<any> {
    const data = await axios.get(url).then((res) => res.data);

    const parsedData = await new Promise((resolve, reject) => {
        parseString(data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    return parsedData;
}