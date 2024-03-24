TODO:
1.  Make Connect the User Logout Frontent with the backend
2.  Make a page for the user for them to edit the User-Data
3.  Add a different login page for the users with the role "business", currently this is being done by manually editing the user role in the Atlas MongoDB. (Default value is "customer", manually changing it to "business" in order to authorise the posting of a new advertisement)
4.  Take Display Picture from Oauth (The initial login does give this picture but it isn't stored in the database)
5.  Deletion of a User and an Advertisement is not implemented yet.

Completed:
1.  User Login by OAuth2
2.  Filtering advertisements as per the user tags and displaying in the Dashboard (A customer sees the ads that have matching tags, while a business sees that ads that it has posted)
3.  Only allowing users with roles of "business" to post an advertisement. The API is protected.
4.  Storing the user data in session



videoDemonstrationLink: https://drive.google.com/drive/folders/1PvB0yKAcJ1_gSuySdOHYvFZPqpgH_Oxk?usp=sharing
