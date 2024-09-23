export {};
// import fetch from 'node-fetch';
// const twilio = require('twilio');
// const dotenv = require('dotenv');
import fetch from 'node-fetch';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID!;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(twilioAccountSid, twilioAuthToken);
let movieList: any[] = [];

async function sendWhatsAppNotification(message: string): Promise<void> {
    try {
        await client.messages.create({
            from: process.env.WHATSAPP_FROM!,
            to: process.env.WHATSAPP_TO!,
            body: message
        });
    } catch (err) {
        console.error(err);
    }
    
}

async function fetchNewReleases(): Promise<void> {
    // const fetch = (await import('node-fetch')).default;
    const url = 'https://api.themoviedb.org/3/movie/now_playing';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`
        }
    };

    fetch(url, options)
        .then((res: import("node-fetch").Response) => res.json())
        .then((json: any) => {
            const movies = json.results;
            movies.forEach((movie: any) => {
                movieList.push(movie.title);
            });
        })
        .then(() => {
            const message = `New movies released:\n${movieList.join('\n')}`;
            sendWhatsAppNotification(message);
        })
        .catch((err: any) => console.error(err));
}

fetchNewReleases();