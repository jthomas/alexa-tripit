# tripit alexa skill 🛫🛬

Alexa skill which returns travel status for a user from TripIt. 

This custom Alexa skill uses an AWS Lambda function which calls the TripIt API to retrieve travel status.

See the demonstration here: https://twitter.com/thomasj/status/1052183561737068544

## input examples

### travel status today

```Where is 
ask tripit where is {name}?
ask tripit where's {name}?
ask tripit where {name} is?
```

`{name}` is used in the response and can be any first name.

###  travel status on date

```
ask tripit where is {name} on {date}
ask tripit where is {name} {date}
```

`{date}` needs to be an absolute or relative date like "*December 12th*" or "*next Monday*".

## output examples

### no trips on date

```
James should be at home. He has no trips scheduled on October 3rd. James's next trip is to  Belgrade, Serbia for Heapcon on October 17th.
```

### trip flight day

```
James is travelling {to||home from} Belgrade, Serbia {after||for} Heapcon 2018 on October 21. His flight leaves Belgrade at 10:25 and arrives in London at 12:30.
```

### during trip

```
James is in Belgrade, Serbia for Heapcon 2018 on October 18. He arrived on October 17 and returns home on October 21.
```

***Note: The TripIt trip name is used as the conference name in the responses.***

## installation

Before starting, you need to email `support@tripit.com` to enable basic HTTP authentication API access for your account as [per their instructions](http://tripit.github.io/api/doc/v1/index.html#authentication_section).

### custom alexa skill

- Create a new Alexa skill from the [Alexa Skills Kit Developer Console](https://developer.amazon.com/alexa/console/ask) with the `tripit` invocation word.

- Import the JSON dialog model for the skill from the `model.json` file.

*This defines a custom `Status` intent with two slot values for `date` and `name`.*

### aws lambda function

- Use the project directory contents in a zip file to create a new AWS Lambda function.
- Set the `EMAIL` and `PASSWORD` environment variables with your TripIt account details.
- Connect the Alexa Skills Kit input event to the function.
- Set the Lambda ARN as the configured endpoint for the Alexa skill in the Dev Console.

## references

There is a German version of the same idea that already exists on Github. If you speak German, check it out...

https://github.com/trieloff/alexa-radar