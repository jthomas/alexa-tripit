const start_date = day => new Date(day)
const end_date = day => new Date(`${day}T23:59:59Z`)

const parse = trip => {
  if (!trip) return null

  const bounds = {
    starts: start_date(trip.start_date),
    ends: end_date(trip.end_date)
  }
  return Object.assign({}, trip, bounds)
}

const within_range = (date, start, end) => date >= start && date <= end
const find = (trips, date) => trips.find(trip => within_range(date, trip.starts, trip.ends))

const find_next = (trips, date) => trips
  .sort((a, b) => a.starts - b.starts)
  .find(trip => trip.starts > date)

const flights = (trip, flights) => {
  if (!trip) return null

  return flights.find(flight => flight.trip_id === trip.id)
}

exports.find = find
exports.find_next = find_next
exports.flights = flights
exports.parse = parse
