import { notFound } from 'next/navigation';
import React from 'react'
import Image from 'next/image';
import BookEvent from '@/components/BookEvent';
import { getSimilarEvents } from '@/lib/actions/event.actions';
import EventCard from '@/components/EventCard';
import { cacheLife, cacheTag } from 'next/cache'


const EventDetailItem = ({icon, alt, label} : {icon: string, alt:string, label:string})=>(
    <div className='flex-row-gap-2 items-center'>
        <Image src={icon} alt={alt} height={17} width={17}/>
        <p>{label}</p>
    </div>
)

const EventAgenda = ({agendaItems } : {agendaItems : string[]}) =>(
    <div className='agenda'>
        <h2>Agenda</h2>
            <ul>
                {agendaItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
                
            </ul>


    </div>
)

const EventTags = ({tags} : {tags: string[]})=>(
    <div className='flex flex-row gap-1.5 flex-wrap'>
        {tags.map((tag) => (
            <div className='pill' key={tag}> {tag}</div>
        ))}
    </div>
)



const EventDetailsPage = async ({params} : {params : Promise <{slug:string}>}) => {

     "use cache";
  cacheLife('hours')
    const {slug} = await params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`);
    const {event} = await response.json();

    if(!event)return notFound();


    const similarEvents =  await getSimilarEvents(slug);
    const booking = 10;

  return (
    <section id='event'>
        <div className="header">
            <h1>Event Description</h1>
            <p >{event.description}</p>
        </div>


        <div className="details">
            {/* Left Side - Event COntent */}
            <div className="content">
                <Image src={event.image} alt={event.title} width={800} height={800} className='banner'/>

                <section className='flex-col-gap-2'>
                    <h2>Overview</h2>
                    <p>{event.overview}</p>
                </section>
                <section className='flex-col-gap-2'>
                         <h2>Event Details</h2>
                        <EventDetailItem icon='/icons/calendar.svg' alt='calendar' label={event.date}/>
                        <EventDetailItem icon='/icons/clock.svg' alt='clock' label={event.time}/>
                        <EventDetailItem icon='/icons/pin.svg' alt='pin' label={event.location}/>
                        <EventDetailItem icon='/icons/mode.svg' alt='mode' label={event.mode}/>
                        <EventDetailItem icon='/icons/audience.svg' alt='audience' label={event.audience}/>
                </section>

                <EventAgenda agendaItems={JSON.parse(event.agenda[0])}/>

                <section className='flex-col-gap-2'>
                        <h2>About the Organizer</h2>
                        <p>{event.organizer}</p>
                </section>

                <EventTags tags={JSON.parse(event.tags[0])}/>

               




            
            </div>


            {/* Right Side - Event COntent */}
            <aside className='booking'>
                    <div className='signup-card'>
                        <h2>Book Your Spot</h2>
                        {booking > 0 ? (
                            <p className='text-sm'>
                                Join {booking} people who have already booked their spot!
                            </p>
                        ) : (
                            <p className='text-sm'>Be the first to book yout spot!</p>
                        )}
                        <BookEvent eventId={event._id} slug={slug}/>
                    </div>
                   
            </aside>
        </div>

         <div className='flex w-full flex-col gap-4 pt-20'>
            <h2>Similar Events</h2>
            <div className="events">

                    {similarEvents.length > 0 && similarEvents.map((item)=> (
                        <EventCard event={item} key={item.slug}/>
            
                    ))}
                </div>
            </div>

    </section>
  )
}

export default EventDetailsPage
