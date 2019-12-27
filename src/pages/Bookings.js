import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner'
import BookingList from '../components/Bookings/BookingList/BookingList'

const BookingsPage = () => {
  const { token } = useContext(AuthContext)
  const [state, setState] = useState({
    isLoading: false,
    bookings: []
  })

  const fetchBookings = async () => {
    setState({ ...state, isLoading: true })
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const resData = await response.json()
      const { bookings } = resData.data
      setState({ ...state, bookings, isLoading: false })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBookingHandler = async bookingId => {
    setState({ ...state, isLoading: true })
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
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
      const updatedBookings = state.bookings.filter(
        booking => booking._id !== bookingId
      )
      setState({ ...state, bookings: updatedBookings, isLoading: false })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return (
    <>
      {state.isLoading ? (
        <Spinner />
      ) : (
        <BookingList
          bookings={state.bookings}
          onDelete={deleteBookingHandler}
        />
      )}
    </>
  )
}

export default BookingsPage
