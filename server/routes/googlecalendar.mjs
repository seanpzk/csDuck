import express from "express";
import dotenv from 'dotenv';
dotenv.config({});
import { google } from "googleapis";
import dayjs from "dayjs";

const router = express.Router();

const calendar = google.calendar({
  version: "v3",
  auth: process.env.API_KEY,

})

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

const scopes = [
  'https://www.googleapis.com/auth/calendar'
];

router.get("/", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
  
    // If you only need one scope you can pass it as a string
    scope: scopes
  });

  res.redirect(url);
});

router.get("/redirect", async (req, res) => {
  const code = req.query.code;

  const {tokens} = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.status(200).send( {text: "login success" });

})

router.post("/schedule_event", async (req, res) => {
  await calendar.events.insert({
    calendarId: 'primary',
    auth: oauth2Client,
    requestBody:{
      summary: req.body.name,
      description: req.body.description,
      start: {
        date: req.body.deadline,
        timeZone: "Asia/Singapore"
      },
      end: {
        date: req.body.deadline,
        timeZone: "Asia/Singapore"
      }
      
    }
  });

  res.status(200).send( {text: "Event scheduled successfully" });
});

export default router;

// END OF GOOGLE CALENDAR API