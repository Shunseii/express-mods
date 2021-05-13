# express-mods

A website which allows users to post custom mods (i.e. modifications) for a selection of different games which others can freely download and apply to tranform their game experience. Only games whose developers allow for the modification of game files will be shown.

## Tech Stack
This is a full-stack web application with the back end being located in a separate repo. The front end uses Next.js, Urql, and Tailwindcss + Sass. Next.js is used for its flexible server-side rendering capabilities as well as the ability to also perform client-side data fetching for specific, dynamic pages. Urql is used as a lightweight GraphQL client that has optional advanced plugins which can be added as necessary. 

Finally, Tailwindcss allows for an extremely convenient flow when building up the application through its abundant utility classes, and the Tailwind directive also allows for transitioning large, unwieldy class names in components into cleaner, more digestible chunks of code in a separate css file. All the code is written in Typescript, and GraphQL Codegen is used to generate GraphQL type definitions from the corresponding files in SDL.

## Features
The project allows users to register and login, post mods for different games, view a list of all mods with cursor-based pagination implemented, like and dislike mods, and reset password via an end-to-end password change flow.

## In-Progress
The core functionality that is still in development: 
- Individual mod display page
- Commenting on mod pages
- Uploading files, cloud storage integration
- Sorting and filtering options
- Categories/tags
- Cloud database integration and hosting
