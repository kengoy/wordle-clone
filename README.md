# Wordle Clone

This is a Wordle Clone app built using TypeScript & React with Vite.
There is a settings where you can change the mode to HARD: you need to solve within 4 turns instead of 6 turns in normal mode.

By using [wordle-API](https://github.com/exciteabletom/wordle-API), guessing logic is completely server-side so that client-side is not able to know the answers until user solves or fails to solve within the required turns.

## Architecture

The general structure is that `src/components/Wordle.tsx` is the main component that can be used from a react application. All controller logic is in the custom hook `src/hooks/useWordle.ts` including the communication with the wordle-API server. All the states and data during a game is stored in the custom hook. Only the state of settings mode(NORMAL or HARD) is stored and dispatched using a reducer.

## Dev environment quick start

Run the Wordle-API server on your local with the following commands.

`cd wordle-API`

`python3 -m venv .venv`

`. .venv/bin/activate`

`python3 -m pip install --upgrade wheel pip`

`python3 -m pip install -r requirements.txt -r requirements-dev.txt`

`pre-commit install`

`python3 init.py`

`FLASK_DEBUG=1 flask run --host=127.0.0.1`

The dev server should accessible on http://127.0.0.1:5000. The local Wordle-API server is allowing ('Access-Control-Allow-Origin', '\*') and http access for local development purpose.

On another terminal, run the Wordle Clone app with the following commands.

`cd wordle-clone`

`npm install`

`npm run dev`

The app should be shown on your browser.
