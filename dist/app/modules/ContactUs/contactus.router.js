"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactus_controller_1 = require("./contactus.controller");
const router = (0, express_1.Router)();
router.get("/all-contact-us", contactus_controller_1.getAllContact);
router.get("/contact-us-details/:id", contactus_controller_1.getContactById);
router.post("/contact-us", contactus_controller_1.createContract);
exports.default = router;
