import fetch from "node-fetch";
import SYSTEM_CONSTANTS from "./constants"

import { URL_DETECT } from "./config";

export default class DetectServiceAPI {
    static host = URL_DETECT;

    static async detectImage(base64string) {
        const fromData = {
            base64_str: base64string
        }
        console.log(`${DetectServiceAPI.host}/${SYSTEM_CONSTANTS.API.DETECT.IMAGE}`);
        const res = await fetch(`${DetectServiceAPI.host}/${SYSTEM_CONSTANTS.API.DETECT.IMAGE}/`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fromData)
        });
        if ( res.ok ) 
            console.log('ok')
        let data = await res.json();
        console.log('data:', data)
        return data;
        
    }


    static async detectVideo(base64string) {
        const fromData = {
            base64_str: base64string
        }
        console.log(`${DetectServiceAPI.host}/${SYSTEM_CONSTANTS.API.DETECT.VIDEO}`);
        const res = await fetch(`${DetectServiceAPI.host}/${SYSTEM_CONSTANTS.API.DETECT.VIDEO}/`, {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fromData)
        });
        if ( res.ok ) 
            console.log('ok')
        let data = await res.json();
        console.log('data:', data)
        return data;
        
    }

}