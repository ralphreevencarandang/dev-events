import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";
import {v2 as cloudinary} from 'cloudinary'
// POST NG EVENTS ROUTE
export async function POST(req: NextRequest){

    try {
        await connectDB();
        // access the data through form
        const formData = await req.formData()
        let event;
        try {
                // get the entries (key:value) from form data and parse it into object
                event = Object.fromEntries(formData.entries());
          } catch (error) {
            console.error('Error parsing event form data: ', error);
            return NextResponse.json({message: 'Invalid JSON format', error: error instanceof Error ? error.message : 'Unknown'}, {status: 400})
        }

            // get the image and define as file
            const file = formData.get('image') as File;

            if(!file){
                return NextResponse.json({message: 'File does\'nt exist' }, {status: 400})
            }

            // conver file into buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject)=>{
                cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'DevEvent'}, 
                    (error, results) => {
                        if(error) return reject(error);
                        resolve(results);
                    }).end(buffer)
            })


            event.image = (uploadResult as {secure_url: string}).secure_url;

            // CREATING AN EVENT
            const createdEvent = await Event.create(event);
            return NextResponse.json({message: 'Event created successfully', event: createdEvent}, {status: 201})
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: 'Event Creation Failed' , error: e instanceof Error ? e.message : 'Unknown'}, {status: 500})
    }
}


export async function GET (){
    try {

        await connectDB();

        const events = await Event.find().sort({createdAt: -1});

        console.log(events);
        

        return NextResponse.json({message:'Data fetch successfully', events: events}, {status:200})
        
    } catch (e) {
        return NextResponse.json({message: 'Error in fetching data', error: e instanceof Error ? e.message : 'Unknown'}, {status: 500})
    }
}