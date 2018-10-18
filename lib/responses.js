const month_day = date => {
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]

  return `${months[date.getMonth()]} ${date.getUTCDate()}`
}

const strip_seconds = time => time.split(':').slice(0, 2).join(':')

const parse_date = date => date.toISOString().split('T')[0]
const is_same_date = (a, b) => parse_date(a) === parse_date(b)

const next_trip = (name, trip) => {
  if (!trip) return ''
  return `${name}'s next trip is to ${trip.primary_location} for ${trip.display_name} on ${month_day(trip.starts)}.`
}

const no_trip = (name, date) => `${name} should be at home. He has no trips scheduled on ${month_day(date)}.`

const location_and_name = (trip, finished) => {
  return `${trip.primary_location} ${finished ? 'after' : 'for'} ${trip.display_name}` 
}

const travel_status = (date, starts, ends) => {
  if (is_same_date(date, starts)) {
    return `travelling to`
  } else if (is_same_date(date, ends)) {
    return `travelling home from`
  }

  return `in`
}

const trip_status = (name, date, trip) => {
  return `${name} is ${travel_status(date, trip.starts, trip.ends)} ${location_and_name(trip, is_same_date(date, trip.ends))} on ${month_day(date)}.`
}

const returning_home = (date, start, end) => {
  if (is_same_date(date, end)) return ''
  if (is_same_date(date, start)) return `He returns home on ${month_day(end)}.`
  return `He arrived on ${month_day(start)} and returns home on ${month_day(end)}.`
}

const flight_status = (flights, returning) => {
  const flight = returning ? flights.Segment[flights.Segment.length - 1] : flights.Segment[0]
  const start_time = strip_seconds(flight.StartDateTime.time)
  const end_time = strip_seconds(flight.EndDateTime.time)
  return `His flight leaves ${flight.start_city_name} at ${start_time}` 
    + ` and arrives in ${flight.end_city_name} at ${end_time}.`
}

const is_travel_day = (date, trip) => is_same_date(date, trip.starts) || is_same_date(date, trip.ends)

const is_returning_today = (date, trip) => is_same_date(date, trip.ends)

const construct = (name, date, current, next, flights) => {
  const responses = []

  // user has no trip scheduled for this date, 
  // respond with details about next trip. 
  if (!current) {
    responses.push(no_trip(name, date), next_trip(name, next))
  // user is currently on a trip, respond with trip details
  } else {
    // current trip status message
    responses.push(trip_status(name, date, current))

    // if trip has flights for this date, add flight status message.
    if (flights && is_travel_day(date, current)) {
      responses.push(flight_status(flights, is_same_date(date, current.ends)))
    }

    // add user message with trip return date.
    if (!is_returning_today(date, current)) {
      responses.push(returning_home(date, current.starts, current.ends))
    }
  }

  return responses.join(' ').trim()
}

exports.construct = construct
