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
const node_fetch_1 = __importDefault(require("node-fetch"));
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = (0, twilio_1.default)(twilioAccountSid, twilioAuthToken);
function sendWhatsAppNotification(message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.messages.create({
            from: process.env.WHATSAPP_FROM,
            to: process.env.WHATSAPP_TO,
            body: message
        });
    });
}
function fetchNewReleases() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.themoviedb.org/3/movie/now_playing`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.API_KEY}`
            }
        };
        (0, node_fetch_1.default)(url, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error(err));
    });
}
