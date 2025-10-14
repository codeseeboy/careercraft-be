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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = uploadFile;
// Simple service that provides a direct URL to use with Magical API
// Simulating the UploadThing behavior with URLs like https://utfs.io/f/...
function uploadFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log(`[UPLOAD SERVICE] Simulating UploadThing upload for file: ${filePath}`);
            // Generate a random file ID that mimics UploadThing's format
            const fileId = Date.now() + "-" + Math.round(Math.random() * 1E9);
            const fileName = ((_a = filePath.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split("\\").pop()) || "file.pdf";
            // Create a fake UploadThing URL
            const url = `https://utfs.io/f/${fileId}-${fileName}`;
            console.log(`[UPLOAD SERVICE] Simulated UploadThing URL: ${url}`);
            return url;
        }
        catch (error) {
            console.error(`[UPLOAD SERVICE] Error simulating UploadThing upload:`, error);
            throw new Error(`Failed to simulate UploadThing: ${error.message}`);
        }
    });
}
