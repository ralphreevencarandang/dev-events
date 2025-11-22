"use server"
import { Event } from "@/database";

export const  getSimilarEvents =  async (slug: string)=>{
    try {

        const event = await Event.findOne({ slug});

        const similarEvents = await Event.find({_id: {$ne: event._id}, tags: {$in: event.tags}})

        console.log('Similar Events: ', similarEvents);
        
        return similarEvents;
        
    } catch (error) {

        return []
        
    }
}