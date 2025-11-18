import * as eventService from '../services/eventService.js';
import Hall from '../models/hallModel.js'; 
import mongoose from 'mongoose';
import UserProfile from '../models/userProfileModel.js';


export async function getApprovedEvents(req, res) {
  try {
    const events = await eventService.getApprovedEvents(req.query);
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}