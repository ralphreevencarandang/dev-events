import React from 'react'
import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'
import { events } from '@/lib/constants'
const page = () => {
  return (
    <section>
        <h1 className='text-center'>The Hub for Every Dev <br /> Event You Can't Miss</h1>
        <p className='text-center mt-5'>Hackatons, Meetups, and Conferences, All in One Place</p>
        <ExploreBtn/>
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <ul className='events'>
              {events.map((event) => (
                  <EventCard event={event} key={event.title}/>
              ))}
          </ul>
        </div>
    </section>
  )
}

export default page
