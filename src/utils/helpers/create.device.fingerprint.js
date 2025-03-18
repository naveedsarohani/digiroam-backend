import crypto from "crypto";
import requestIp from "request-ip";
import useragent from 'useragent';
import axios from 'axios';

const createDeviceFingerprint = async (req) => {
    // extract  ip address
    const ip = requestIp.getClientIp(req) || 'unknown-ip';

    // extract user-agent (broswer, os, device)
    const agent = useragent.parse(req.headers['user-agent']);
    const browser = agent.family || 'unknown-browser';
    const os = agent.os.family || 'unknown-os';
    const deviceName = agent.device.family || 'unknown-device';

    // gett location using IP (free API: ipinfo.io)
    let location = 'unknown-location';
    try {
        const response = await axios.get(`https://ipinfo.io/${ip}/json`);
        location = `${response.data.city}, ${response.data.country} (${response.data.org})`;
    } catch (error) {
        throw error;
    }

    // create a unique fingerprint hash
    const rawFingerprint = `${ip}-${browser}-${os}-${deviceName}`;
    const fingerprint = crypto.createHash('sha256').update(rawFingerprint).digest('hex');

    return {
        fingerprint, ip, browser, os, deviceName, location, loginTime: new Date()
    };
};

export default createDeviceFingerprint;


// import useragent from 'useragent';
// import crypto from "crypto";
// import axios from 'axios';
// import geoip from "geoip-lite";

// const createDeviceFingerprint = async (req) => {
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     const agent = useragent.parse(req.headers['user-agent']);

//     let location = geoip.lookup(ip);
//     if (!location) {
//         try {
//             const response = await axios.get(`http://ip-api.com/json/${ip}`);
//             location = response.data;
//         } catch (error) {
//             console.log("Geo API Error:", error.message);
//         }
//     }

//     const fingerprint = `${ip}-${agent.family}-${agent.os.family}-${agent.device.family}`;
    
//     const fingerprintHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

//     return {
//         fingerprint: fingerprintHash,
//         ip,
//         browser: agent.family,
//         os: agent.os.family,
//         device: agent.device.family,
//         location
//     };
// };

// export default createDeviceFingerprint;

