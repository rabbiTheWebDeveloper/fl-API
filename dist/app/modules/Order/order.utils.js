"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueNumber = void 0;
const generateUniqueNumber = () => {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number
    // Generate a random number between min and max (inclusive)
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
};
exports.generateUniqueNumber = generateUniqueNumber;
const uniqueNumber = (0, exports.generateUniqueNumber)();
