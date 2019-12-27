import React from 'react'
import './EventItem.css'

const EventItem = ({
  _id,
  title,
  userId,
  creatorId,
  price,
  date,
  onDetail,
  eventId
}) => {
  return (
    <li key={_id} className='events__list-item'>
      <div>
        <h1>{title}</h1>
        <h2>
          ${price} - {new Date(date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {userId === creatorId ? (
          <p>You're the owner of this event.</p>
        ) : (
          <button className='btn' onClick={() => onDetail(eventId)}>
            View Details
          </button>
        )}
      </div>
    </li>
  )
}

export default EventItem
