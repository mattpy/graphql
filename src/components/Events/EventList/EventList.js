import React from 'react'
import './EventList.css'
import EventItem from './EventItem/EventItem'

const EventList = ({ events, authUserId, onViewDetail }) => {
  return (
    <ul className='event__list'>
      {events.map(event => (
        <EventItem
          userId={authUserId}
          eventId={event._id}
          title={event.title}
          key={event._id}
          creatorId={event.creator._id}
          price={event.price}
          onDetail={onViewDetail}
          date={event.date}
        />
      ))}
    </ul>
  )
}

export default EventList
