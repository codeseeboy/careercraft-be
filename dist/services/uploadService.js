"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToTmpfiles = uploadToTmpfiles;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
function uploadToTmpfiles(localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`[UPLOAD SERVICE] Uploading file: ${localFilePath} to tmpfiles.org`);
            const formData = new form_data_1.default();
            formData.append("file", fs_1.default.createReadStream(localFilePath));
            const res = yield axios_1.default.post("https://tmpfiles.org/api/v1/upload", formData, {
                headers: formData.getHeaders(),
            });
            let url = res.data.data.url;
            console.log(`[UPLOAD SERVICE] Original URL from tmpfiles.org: ${url}`);
            if (url) {
                try {
                    const fileIdMatch = url.match(/tmpfiles\.org\/(\d+)\//);
                    if (fileIdMatch && fileIdMatch[1]) {
                        const fileId = fileIdMatch[1];
                        url = `https://tmpfiles.org/dl/${fileId}`;
                        console.log(`[UPLOAD SERVICE] Successfully extracted file ID: ${fileId}`);
                    }
                    else {
                        console.error(`[UPLOAD SERVICE] Couldn't extract file ID from URL: ${url}`);
                        if (url.startsWith('http:')) {
                            url = url.replace('http:', 'https:');
                            console.log(`[UPLOAD SERVICE] Using fallback URL: ${url}`);
                        }
                    }
                }
                catch (error) {
                    console.error(`[UPLOAD SERVICE] Error processing URL: ${error}`);
                    if (url.startsWith('http:')) {
                        url = url.replace('http:', 'https:');
                        console.log(`[UPLOAD SERVICE] Using fallback URL: ${url}`);
                    }
                }
            }
            console.log(`[UPLOAD SERVICE] File uploaded successfully. Public URL: ${url}`);
            return url;
        }
        catch (error) {
            console.error(`[UPLOAD SERVICE] Error uploading to tmpfiles.org:`, error);
            if (error.response) {
                console.error(`[UPLOAD SERVICE] Response status: ${error.response.status}`);
                console.error(`[UPLOAD SERVICE] Response data:`, error.response.data);
            }
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    });
}
