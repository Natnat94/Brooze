# Project Brooze

Proudly served at [Project13-website](https://project13.nathan-mimoun.live)

## Getting started

To run the application, it's recommended to setup a virtual environment with PostGIS.

### Run Brooze on localhost:
- Clone the git repo
- Install dependencies:

    ``` pipenv install```

    ``` cd frontend/```

    ```npm install```

- Set the DB 'djangotest' with username 'postgres' & password 'nathan':
- Populate the DB:
    
    ```pipenv run manage.py migrate```

    ```pipenv run manage.py shell```

    ```from shops.load import run```

    ```run()```
    
- Run the webservers:

     ```pipenv run manage.py runserver```

  in the folder 'frontend' run: 

     ```npm run start```
- Go to the address provided by the npm serve
      
- Enjoy !


## Version log:
### Version 0.5:

  - [x] Register
  - [x] Login
  - [x] Change Password
  - [x] Add friends
  - [x] Find best bar for meeting
