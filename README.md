# Trade Request Backend
This is a basic API built to pull data from a csv file [iphones.csv](/iphones.csv), format it, store it in a db and open up endpoint for trigeering the script and fetching the data from the 
db with a lot of filters

## Features
- Pull data from csv file
- Format the data and store in db
- Fetch the data from db with filter options like name, grade, storage size and price

# Technologies Used
- [Express](https://expressjs.com/)  is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

- [MongoDB](https://www.mongodb.com) MongoDB is a document database with the scalability and flexibility that you want with the querying and indexing that you need

- [Mongoose](https://mongoosejs.com/) is an elegant mongodb object modeling for NodeJs

- [Babel](https://babeljs.io/) is a JavaScript compiler for converting codes written in ES6 to ES5 that is supported by many browsers

## Installation
- Clone this repository using the command:
 ```git clone https://github.com/Orlayhemmy/trade_requests_BE.git```
 
- Navigate to the directory:
  ```cd trade_requests_BE```
- Install all dependencies with ```yarn install```
- Start the development server by running:
  ```yarn start:dev``` OR
- Start the production server by running:
  ```yarn start```
- Open up `PostMan` to test

## [](#test)Running the tests
To run the tests written for this application.

- Test hasn't been incoporated yet due to time constraint

## Author
* **Olayemi Lawal**

## FAQ

### Is this an Open-Source Application?

Yes it is, and contributing to the development of this application is by raising PRs.

### How to contribute?

NB: contributions are very much welcome, please see the [Contribute.md](/Contribute.md) file on how to contribute

### What language was used to develop this application?

This project is a server-side(NodeJs) based application.

### Can I clone this application for personal use?

Yes! This application is licensed under MIT, and is open for whatever you may choose 
to use it for.