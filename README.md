# location-service
## Description 
This API must expose the following two endpoints
* POST /visit
    * Accepts POST requests with ‘application/json’ types
    * The schema for submitted objects is as follows:
        * userId - the user that is submitting the location
        * name - the name of the location   
    * Returns a visitId which can be referenced in the GET. Visit IDs are globally unique to the location submission
* GET /visit
    * Can be queried with either of the following patterns:
        * visitId 
        * both of the following two query params: 
            * userId
            * searchString- A string which is attempted to be matched over the 5 most recent locations the user has visited. The matching    should be fuzzy, and case insensitive
    * Returns an array of arrival objects that was submitted to the POST

## run
```npm install``` <br />
```firebase deploy```
## test
You can use the Postman to test the post/get request like below.

**baseURL:** https://us-central1-location-service-28182.cloudfunctions.net/webApi/api/v1/locations

**Examples:**

POST /visit 

params = { userId: “user1”, name: “McDonald’s” }

Returns: { visitId: “some-visit-id-1” }

************************************
GET /visit?visitId=some-visit-id-1

Returns: [{ userId: “user1”, name: “McDonald’s”, visitId: “some-visit-id-1” }]

************************************
POST /visit        

params = { userId: “user1”, name: “Starbucks” }

Returns: { visitId: “some-visit-id-2” }

************************************
GET /visit?userId=user1&searchString=MCDONALD’S LAS VEGAS

Returns: [{ userId: “user1”, name: “McDonald’s”, visitId: “some-visit-id-1” }]

************************************
POST /visit        

params = { userId: “user2”, name: “Starbucks” }

Returns: { visitId: “some-visit-id-3” } 

************************************
GET /visit?userId=user2&searchString=APPLE

Returns: []

