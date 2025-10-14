"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callMagicalReview = callMagicalReview;
exports.callMagicalScore = callMagicalScore;
exports.callMagicalStatus = callMagicalStatus;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// Ensure environment variables are loaded
dotenv_1.default.config();
const REVIEW_URL = process.env.MAGICAL_REVIEW_URL;
const SCORE_URL = process.env.MAGICAL_SCORE_URL;
const API_KEY = process.env.MAGICAL_API_KEY;
const HEADERS = {
    "Content-Type": "application/json",
    "api-key": API_KEY,
};
// Log configuration on startup
console.log('=== MAGICAL API CONFIGURATION ===');
console.log('Review URL:', REVIEW_URL || 'UNDEFINED');
console.log('Score URL:', SCORE_URL || 'UNDEFINED');
console.log('API Key:', API_KEY ? 'Loaded successfully' : 'UNDEFINED - Check .env file');
console.log('Headers:', HEADERS);
// Add a helper function to validate URLs
function validateUrl(url) {
    try {
        new URL(url);
        return url.startsWith('http');
    }
    catch (_a) {
        return false;
    }
}
// Helper function to wait and get final result with just ONE more API call
async function waitAndGetFinalResult(requestId) {
    var _a, _b;
    console.log(`
=== WAITING FOR PROCESSING ===
Request ID: ${requestId}
Waiting 30 seconds before checking final result...
This gives MagicalAPI time to process without wasting credits on multiple calls`);
    // Wait 30 seconds for processing to complete
    await new Promise(resolve => setTimeout(resolve, 30000));
    console.log(`
=== GETTING FINAL RESULT ===
Request ID: ${requestId}
Making single API call to get completed score...`);
    try {
        const finalResp = await axios_1.default.post(SCORE_URL, { request_id: requestId }, { headers: HEADERS });
        console.log(`Final Response:`, JSON.stringify(finalResp.data, null, 2));
        // Check if we have a final result (score data)
        if (((_b = (_a = finalResp.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.score) !== undefined) {
            console.log(`
🎉 SUCCESS! Score found: ${finalResp.data.data.score}
Total API calls used: 2 (initial + final)`);
            return finalResp.data;
        }
        else {
            console.log(`
⚠️ Processing still not complete after 30 seconds
This might need more time, but we won't waste more credits
Response:`, finalResp.data);
            return finalResp.data;
        }
    }
    catch (error) {
        console.error(`❌ Final result fetch failed:`, error.message);
        throw error;
    }
}
async function callMagicalReview(url) {
    try {
        console.log(`
=== MAGICAL API RESUME REVIEW REQUEST ===
URL: ${url}
URL Valid: ${validateUrl(url)}
Endpoint: ${REVIEW_URL}
API Key: ${API_KEY ? `${API_KEY.substring(0, 15)}...` : 'UNDEFINED!'}
Headers:`, HEADERS);
        if (!validateUrl(url)) {
            throw new Error(`Invalid URL provided: ${url}`);
        }
        const requestBody = { url };
        console.log(`Review Request Body:`, JSON.stringify(requestBody, null, 2));
        const resp = await axios_1.default.post(REVIEW_URL, requestBody, { headers: HEADERS });
        console.log(`
=== REVIEW RESPONSE ===
Status: ${resp.status} ${resp.statusText}
Response Headers:`, resp.headers);
        console.log(`Review Response Data:`, JSON.stringify(resp.data, null, 2));
        return resp.data;
    }
    catch (error) {
        console.error(`
=== REVIEW ERROR ===
Error Message: ${error.message}`);
        if (error.response) {
            console.error(`Response Status: ${error.response.status}`);
            console.error(`Response Headers:`, error.response.headers);
            console.error(`Response Data:`, JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}
async function callMagicalScore(url, jobDescription) {
    var _a, _b;
    try {
        console.log(`
=== MAGICAL API RESUME SCORE REQUEST ===
URL: ${url}
URL Valid: ${validateUrl(url)}
Job Description Length: ${jobDescription.length} characters
Job Description Preview: ${jobDescription.substring(0, 200)}...
Endpoint: ${SCORE_URL}
API Key: ${API_KEY ? `${API_KEY.substring(0, 15)}...` : 'UNDEFINED!'}
Headers:`, HEADERS);
        if (!validateUrl(url)) {
            throw new Error(`Invalid URL provided: ${url}`);
        }
        if (!jobDescription || jobDescription.trim().length < 10) {
            throw new Error(`Job description too short or empty: ${jobDescription.length} characters`);
        }
        const requestBody = {
            url,
            job_description: jobDescription
        };
        console.log(`Request Body:`, JSON.stringify(requestBody, null, 2));
        // Step 1: Send initial request to get request_id
        const initialResp = await axios_1.default.post(SCORE_URL, requestBody, { headers: HEADERS });
        console.log(`
=== INITIAL MAGICAL API RESPONSE ===
Status: ${initialResp.status} ${initialResp.statusText}
Response Headers:`, initialResp.headers);
        console.log(`Initial Response Data:`, JSON.stringify(initialResp.data, null, 2));
        // Extract request_id from response
        const requestId = (_b = (_a = initialResp.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.request_id;
        if (!requestId) {
            console.error('No request_id found in response!');
            return initialResp.data;
        }
        console.log(`
=== STARTING SMART WAITING ===
Request ID: ${requestId}
Will wait 30 seconds then get final result with just ONE more API call...`);
        // Step 2: Wait and get final result with just ONE more call
        const finalResult = await waitAndGetFinalResult(requestId);
        console.log(`
=== FINAL SCORE RESULT ===
Complete Response:`, JSON.stringify(finalResult, null, 2));
        return finalResult;
    }
    catch (error) {
        console.error(`
=== MAGICAL API ERROR ===
Error Message: ${error.message}`);
        if (error.response) {
            console.error(`Response Status: ${error.response.status}`);
            console.error(`Response Headers:`, error.response.headers);
            console.error(`Response Data:`, JSON.stringify(error.response.data, null, 2));
        }
        if (error.request) {
            console.error(`Request that failed:`, error.request);
        }
        throw error;
    }
}
async function callMagicalStatus(requestId) {
    try {
        console.log(`
=== MAGICAL API STATUS CHECK ===
Request ID: ${requestId}
Endpoint: ${SCORE_URL}
Using same endpoint as score request per documentation`);
        const requestBody = { request_id: requestId };
        console.log(`Status Request Body:`, JSON.stringify(requestBody, null, 2));
        // Use the same endpoint that initiated the request (score URL for status checks per docs)
        const resp = await axios_1.default.post(SCORE_URL, requestBody, { headers: HEADERS });
        console.log(`
=== STATUS CHECK RESPONSE ===
Status: ${resp.status} ${resp.statusText}
Response Headers:`, resp.headers);
        console.log(`Status Response Data:`, JSON.stringify(resp.data, null, 2));
        return resp.data;
    }
    catch (error) {
        console.error(`
=== STATUS CHECK ERROR ===
Error Message: ${error.message}`);
        if (error.response) {
            console.error(`Response Status: ${error.response.status}`);
            console.error(`Response Headers:`, error.response.headers);
            console.error(`Response Data:`, JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}
//# sourceMappingURL=magicalApi.js.map