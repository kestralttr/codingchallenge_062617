# Mapplication

## Goal

This application was created to showcase the power of Google Maps and Google Places.  Queries can be made to the Google Places API, and results are displayed in text format with corresponding markers on the map.

## Architecture & Technologies

Mapplication is built on a foundation of plain JavaScript, HTML5, and CSS3. Requests are made to both Google Maps and Places APIs.  The lack of larger libraries keeps the file size down and due to the simplicity of the idea, frameworks such as React or Angular were avoided since the desired functionality is easily achievable without them.

All JavaScript code is located within javascript.js.  All functions and data are located within an all-encompassing initMap function, which has been defined in the Google Maps script tag as the function that the API uses to instantiate the map.

## How It Works

Upon loading the web page, the user is prompted to allow the site to access their location.  Without granting access to the user's location, the application will not proceed.

Once this access has been granted, the Google Maps object loads and is displayed on the screen.  The user can zoom in and out, scroll around, and interact with the Google Maps object as they see fit.

However, by entering text into the input field and clicking the search button, a request will be fired to the Google Places API.  The application will then display the name and address of the returned Places in a results-container object that animates in from the left side of the screen.  Corresponding markers are rendered in the Google Map.

Hovering over any of the Places on the left side of the screen will cause the corresponding marker to bounce.  Clicking on the Place list item will zoom in on the corresponding marker.  Clicking the checkbox on the Place list item will change the color of the corresponding marker green, allowing the user to select certain markers and make them more easily visible.

A reset button is available to clear all Places, markers, and the input field, returning the map to its former, near-full width of the window.

## Future Plans

I was interested in how this application could persist data from various users.  I would likely avoid implementing user authentication, namely because it seems like overkill for such a simple app.  However, I think that browser cookies could be used to keep track of stored/saved pins and locations, and display them upon repeat visits.
