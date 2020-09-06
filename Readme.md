# Project Brooze

[![Build Status](https://travis-ci.org/Natnat94/project_13.svg?branch=master)](https://travis-ci.org/Natnat94/project_13)

Proudly served at [Project13-website](https://projet13.nathan-mimoun.live)

> Have you ever experienced the pain of organizing a drink with friends right after work? <br> 
> Selecting the best bar according to each one location, texting/calling each friend to check who is available? 
> 
> Brooze is here to help!! 
> 
> Once registered, add you registered friends into your friends list, click on the action button and voila! :) <br>
Brooze send a notification to every member of your friends list with the best bar location according to each one current location.

This project is the last project of my OpenClassrooms Python course.
<br>The goal is to show my knowledge after completing all the course, the subject was chosen by me.

This project is meant to become a PWA application.

**This is still in development stage**


## Getting started

To run the application, it's recommended to setup a virtual environment with PostGIS.
See [Here](https://docs.djangoproject.com/en/3.0/ref/contrib/gis/tutorial/#setting-up)

### Run Brooze on localhost:
- Clone the git repo
- Install dependencies:

    ``` 
    pipenv install
    cd frontend/
    npm install
    ```

- Set the DB 'djangotest' with username 'postgres' & password 'nathan':
- Populate the DB:
    
    ```pipenv run manage.py migrate
    pipenv run manage.py shell
    from shops.load import run
    run()
    ```
    
- Run the webservers:

     ```
     pipenv run manage.py runserver
     ```

  in the folder 'frontend' run: 

     ```
     npm run start
     ```

- Go to the address provided by the npm serve
      
- Enjoy !


## Version log:
### Version 0.5:

  - [x] Register
  - [x] Login
  - [x] Change Password
  - [x] Add friends
  - [x] Find best bar for meeting

### Version 0.6: (mainly frontend improvement)

  - [x] Better handling of error message from the API
  - [x] Expanding the size of the bar entries in the DB
  - [x] Enhancing the popup content display
  - [x] Storing the session token in the ~~cookies~~ local storage
  - [x] Add a logout function on the frontend side

### Version 0.7: (mainly backend improvement)
  - [x] Add clustering on the map
  - [x] Confirmation email
  - [ ] Enhancing the token use with an additional short term token
  - [x] Adding a phone number into the user profile
  - [ ] Fixing the sketchy bars data 

### Version 0.8: (mainly frontend improvement)

  - [ ] Adding tests for the frontend
  - [ ] Switching from standard markers to customized markers
  - [x] Switching to a footer nav bar for mobile screen (temporarily default)
  - [ ] Adding a welcome screen
  - [x] Profile details added
