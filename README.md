# Wordle Clone

This is a Wordle Clone app built using TypeScript & React with Vite.
There is a settings where you can change the mode to HARD: you need to use any revealed hints in subsequent guesses.

By using [wordle-API](https://github.com/exciteabletom/wordle-API), guessing logic is completely server-side so that client-side is not able to know the answers until user solves or fails to solve within the required turns.

## Architecture

The general structure is that `src/components/Wordle.tsx` is the main component that can be used from a react application. All controller logic is in the custom hook `src/hooks/useWordle.ts` including the communication with the wordle-API server. All the states and data during a game is stored in the custom hook. Only the state of settings mode(NORMAL or HARD) is stored and dispatched using a reducer.

## Dev environment quick start

### Prerequisites

1. [Install Node.js and npm](https://nodejs.org/en/download/) v18.10.0 (npm 9.5.1) or higher
1. [Install Python 3](https://www.python.org/downloads/) 3.9 or higher

### Run a local Wordle-API server

Clone my customized [wordle-API](https://github.com/kengoy/wordle-API) and run the Wordle-API server on your local with the following commands.

`python3 -m venv .venv`

`. .venv/bin/activate`

`python3 -m pip install --upgrade wheel pip`

`python3 -m pip install -r requirements.txt -r requirements-dev.txt`

`pre-commit install`

`python3 init.py`

`FLASK_DEBUG=1 flask run --host=127.0.0.1`

The dev server should accessible on http://127.0.0.1:5000. The customized Wordle-API server is allowing ('Access-Control-Allow-Origin', '\*') and http access for local development purpose.

### Run Wordle Clone app

On another terminal, run this Wordle Clone app with the following commands.

`npm install`

`npm run dev`

The app should be shown on your browser.
