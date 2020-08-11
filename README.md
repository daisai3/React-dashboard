## CJA Dashboard

Made with [React.js 16.8+](https://es.reactjs.org)

#### Test creds:

admin@dewa.com
test_admin

### Docker for development

To run as a docker:

Run the docker-compose file on the backend repository (here)[https://gitlab.com/dive.tv/cja/cja-api-backend]

If running on **smaug**, you must forward port 3000 for the frontend and port 5000 for the backend

And it will be available at http://localhost:3000

### Local

To run it in localhost, you will need **Node.js** installed:

Install **yarn** using NPM as a global dependency if you don't have it:

`npm install -g yarn`

To install project dependencies run:
`yarn`

To start development server on localhost run:
`yarn start`

To run all tests:
`yarn test`

To run linter:
`yarn lint`
