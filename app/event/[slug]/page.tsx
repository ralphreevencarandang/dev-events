import { notFound } from 'next/navigation';
import React from 'react'

const EventDetailsPage = async ({params} : {params : Promise <{slug:string}>}) => {

    const {slug} = await params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`);
    const {event} = await response.json();

    if(!event)return notFound();
    if(event) console.log('event: ', event);
    
    


  return (
    <section id='event'>
        <h1>Event Details: <br /> {slug}</h1>

    </section>
  )
}

export default EventDetailsPage
