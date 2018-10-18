const Alexa = require('ask-sdk-core')

const tripit = require('./lib/tripit.js')
const trips = require('./lib/trips.js')
const responses = require('./lib/responses.js')

const StatusIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'Status';
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots
    const name = slots.name.value
    const date = slots.date.value ? (new Date(slots.date.value)) : (new Date())
    try {
      const results = await tripit.retrieve(process.env.EMAIL, process.env.PASSWORD)
      const parsed = results.Trip.map(trips.parse)
      const trip = trips.find(parsed, date)
      const next_trip = trips.find_next(parsed, date)
      const flights = trips.flights(trip, results.AirObject)

      const message = responses.construct(name, date, trip, next_trip, flights)
      console.log('sending response', message)

      return handlerInput.responseBuilder
        .speak(message)
        .getResponse();
    } catch (err) {
      console.log(`error found retrieving trip information.`);
      console.log(err)
      return handlerInput.responseBuilder
        .speak(`Hmmm I'm having problems retrieving trip information for ${name} at this moment. Please try again later.`)
        .getResponse();
    }
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
}

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(StatusIntentHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda();
