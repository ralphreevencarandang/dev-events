import { NextResponse, NextRequest } from "next/server";


import connectDB from "@/lib/mongodb";
import { Event, IEvent } from "@/database";

type RouteParams ={
     params: Promise<{
        slug: string;
    }>;
}


export async function GET (req: NextRequest, {params} : RouteParams) : Promise <NextResponse>{
    try {

        await connectDB();

        // await amd extract slug from params
        const {slug} = await params;

        // Validate slug parameter
        if(!slug || typeof slug !== 'string' || slug.trim() == ''){
            return NextResponse.json(
                {message: 'Invalid or missing slug parameter'},
                {status: 400}
            )
        }

        // Sanitize slug
        const sanitizedSlug = slug.trim().toLowerCase();


        // Query event by slug

        const event = await Event.findOne({slug: sanitizedSlug}).lean();

        if(!event){
            return NextResponse.json(
                {message: `Event with slug '${sanitizedSlug}' not found`},
                 {status: 404})
        }




        return NextResponse.json({message: 'Fetch successfully', event }, {status: 200});
        
    } catch (error) {
        console.log('Error in fetching single event: ', error);
        
        return NextResponse.json({message:'Error Fetching Single Item'}, {status: 500})
    }
}