import React, { useState, useContext, useEffect } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'
import EventList from '../components/Events/EventList/EventList'
import Spinner from '../components/Spinner/Spinner'

const EventsPage = () => {
  const { token, userId } = useContext(AuthContext)
  const [creating, setCreating] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [values, setValues] = useState({
    title: '',
    price: 0,
    date: '',
    description: ''
  })
  let isActive = true

  const modalConfirmHandler = async () => {
    setCreating(false)
    const { title, price, date, description } = values

    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return
    }
    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${+price}, date: "${date}"}) {
            _id
            title
            description
            date
            price
          }
        }
      `
    }

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const resData = await response.json()
      const { createEvent } = resData.data
      createEvent.creator = {
        _id: userId
      }
      setEvents([...events, createEvent])
    } catch (error) {
      console.log(error)
    }
  }

  const modalCancelHandler = () => {
    setCreating(false)
    setSelectedEvent(null)
  }

  const updateState = e => {
    setValues({ ...values, [e.target.id]: e.target.value })
  }

  const fetchEvents = async () => {
    setIsLoading(true)
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    }

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const resData = await response.json()
      const { events } = resData.data
      if (isActive) {
        setEvents(events)
        setIsLoading(false)
      }
    } catch (error) {
      if (isActive) {
        setIsLoading(false)
      }
    }
  }

  const showDetailHandler = eventId => {
    const selectEvent = events.find(e => e._id === eventId)
    setSelectedEvent(selectEvent)
  }

  const bookEventHandler = async () => {
    if (!token) {
      setSelectedEvent(null)
      return
    }
    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            createdAt
            updatedAt
          }
        }
      `
    }

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const resData = await response.json()
      console.log(resData)
      setSelectedEvent(null)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchEvents()
    return () => {
      isActive = false
    }
  }, [])

  return (
    <>
      {creating && (
        <>
          <Backdrop onCancel={modalCancelHandler} />
          <Modal
            title='Add Event'
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
            confirmText='Confirm'
          >
            <form>
              <div className='form-control'>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' onChange={updateState} />
              </div>
              <div className='form-control'>
                <label htmlFor='price'>Price</label>
                <input type='number' id='price' onChange={updateState} />
              </div>
              <div className='form-control'>
                <label htmlFor='date'>Date</label>
                <input type='datetime-local' id='date' onChange={updateState} />
              </div>
              <div className='form-control'>
                <label htmlFor='description'>Description</label>
                <textarea
                  id='description'
                  rows='4'
                  onChange={updateState}
                ></textarea>
              </div>
            </form>
          </Modal>
        </>
      )}
      {selectedEvent && (
        <>
          <Backdrop onCancel={modalCancelHandler} />
          <Modal
            title={selectedEvent.title}
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={bookEventHandler}
            confirmText={token ? 'Book' : 'Confirm'}
          >
            <h1>{selectedEvent.title}</h1>
            <h2>
              ${selectedEvent.price} -{' '}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{selectedEvent.description}</p>
          </Modal>
        </>
      )}
      {token && (
        <div className='events-control'>
          <p>Share your own Events!</p>
          <button className='btn' onClick={() => setCreating(!creating)}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          authUserId={userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  )
}

export default EventsPage
