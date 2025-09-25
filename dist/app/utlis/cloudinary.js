"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: 'dmp8slbwf',
    api_key: '225799237637354',
    api_secret: '36BoRes_x4p98wmq8fseP8dV6uo'
});
exports.default = cloudinary_1.v2;
