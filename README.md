# Project AIread API Backend

* node with babel
* expressjs
* airbnb eslint rules

## What worked
OpenAI is implemented. More work needs to be done on the chunkification (splitting of text into chunks), and on the prompting of the model.

## What didn't
I couldn't figure out how to test my endpoints with the auth middleware up (I needed a Firebase auth token, I don't know where to get one, I couldn't figure it out) so I just commented out the middleware for now. Auth can be reenabled later, closer to prod.

## URL
https://project-airead-api.onrender.com

## Setup
To run locally, first retrieve a valid `credentials.json` file and copy it into the root-level directory of the project. One such `credentials.json` file can be found in the CS52 airead slack channel. Then, run `npm install` and then `npm start`

## Deployment
Settings for render.com:
* build command:  `npm install && npm run build`
* run command:  `npm run prod`
