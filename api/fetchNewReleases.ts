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
let tvShowList: any[] = [];

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

function getUSTvShowsAiringToday() {
    const url = 'https://api.themoviedb.org/3/tv/airing_today';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.API_READ_ACCESS_TOKEN}`
        }
    };

    fetch(url, options)
        .then((res: import('node-fetch').Response) => res.json())
        .then((json: any) => {
            const movies = json.results;

            // Filter only U.S. shows and add to movieList
            movies.forEach((movie: any) => {
                if (movie.origin_country.includes('US')) {
                    tvShowList.push(movie.name); // Assuming `name` is the title for TV shows
                }
            });
        })
        .then(() => {
            // Create a message with a top-down list of new shows
            const message = `New U.S. TV shows airing today:\n${tvShowList.join('\n')}`;
            // console.log(tvShowList);
            // Send the WhatsApp notification
            return sendWhatsAppNotification(message);
        })
        .catch((err: any) => console.error('Error fetching or sending data:', err));
}

fetchNewReleases();
getUSTvShowsAiringToday();