# Sirius Backend Code Challenge: Email Service

Create a service that accepts the necessary information and sends emails. It should provide an abstraction between two different email service providers. If one of the services goes down, your service can quickly failover to a different provider without affecting your customers.

## Suggested Email Providers
Example Email Providers: 
- SendGrid 
- Simple Send Documentation 
- Mailgun 
- Simple Send Documentation 
- SparkPost 
- Developer Hub 
- Amazon SES 
- Simple Send Documentation

All listed services are free to try and are pretty painless to sign up for, so please register your own test accounts on each.

Each User should be limited to 1000 emails a day. After that he should get an error message until his quota is reseted the next day.
Feel free to use any other providers you are more familiar with , just let us know!

## Users and Authentication
Users must register first to use the API. User login must be using a username password flow.
Users should be authenticated to make requests to the API. You must implement JWT authentication for this service. JWT token must expire after 1 hour.

## Stats
Only the Admin user for the service can call a /stats endpoint which will retrun a list of all the users and the number of emails they have sent during that day, users who have not used the service should be filtered out.
If a non admin user makes a request for stats they should get a 403 Forbidden error.

## Testing
You should include tests as part of your deliverable. You can choose whatever testing strategy you want. Think of this as a production level API.

## Language and Restrictions
You can use any of the following languages to complete the challenge:
- Java
- Javascript/Typescript (Node.js) 
- Go
- Python 
- Kotlin

You are also free to use any framework and library you find suitable. You can use an in memory database or any database engine you are used to, like PostgreSQL, MySQL, Mongo, etc.

## Additional Points
- Create a docker image for running the API on a container CI/CD
- Pipelines with test checking
- Usage of Gitflow branching strategy. Read more here
- Deploy your app to a cloud solution (AWS,GCP,Heroku,etc.)
- Swagger Documentation.
- Any cool idea you have that might improve the project