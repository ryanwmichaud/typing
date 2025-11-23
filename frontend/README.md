# Fret Synth

Real-Time Keyboard Synth - [Deployed online here](https://typing.ryanwmichaud.com)


## Description

Use your computer keyboard to control a synthesizer mapped to the tuning of your favorite string instrument. 
Each row on your keyboard acts as a string and increases in pitch from left to right. 
Click on the calibration buttons and follow the prompts to customize for your unique keyboard layout. 
Use the up and down arrow keys for half and whole step pitch bends. 


### Requirements 
  * Node.js
  * Git
    
### To Run Locally For Customization

* Clone this repository
* Navigate to the frontend folder with `cd frontend`
* run `npm install` to install Node dependencies
* `npm run dev` to start development server or `vite --port <port_number>` to run on a specific port
  * App will be served on localhost:3000 by default

### To Run the Backend Locally 

* Clone this repository
* Navigate to the backend folder with `cd backend`
* create a virtual python environment with `python3 -m venv .venv`
* activate the virtual environment with `source .venv/bin/activate`
* install dependencies with `pip install -r requirements.txt`
* run the local development server with `flask --app server run`
  * Server will run on localhost:5000 by default, note that this may interfere with airplay receiver on MacOS. 

Feel free to reach out to ryanwmichaud@gmail.com with any questions!


