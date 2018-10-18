'use strict';

const fetch = require('node-fetch')

const LIST_TRIPS_URL = 'https://api.tripit.com/v1/list/trip?format=json&include_objects=true'

const to_base64 = source => {
  return Buffer.from(source).toString('base64')
}

const auth_header_value = (username, password) => {
  const encoded = to_base64(`${username}:${password}`)
  return `Basic ${encoded}`
}

const auth_header = (username, password) => {
  return { Authorization: auth_header_value(username, password) }
}

const retrieve = async (username, password) => {
  if (!username || !password) throw new Error('missing username or password')

  const headers = auth_header(username, password)
  const response = await fetch(LIST_TRIPS_URL, { headers })
  return await response.json()
}

exports.retrieve = retrieve
