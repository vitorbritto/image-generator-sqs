# Image Generator

This is a simple image generator, that uses SQS to generate images based on the quantity selected by the user.

## Technologies

### Client

- Alpine JS
- Tailwind

### Server

- Node.js
- Express

## How to run the project

### Requirements

You must set your AWS credentials in the `.env` file in the server project. Also, you must have an SQS queue created and set the URL too.

```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_SQS_URL=your-sqs-url
```

### Installation

- Clone the repository with `git clone`
- Install the dependencies with `npm install`
- Run the client with `npm start`
- Run the server with `npm run generator`

### Usage

- Access the project on `http://localhost:3000`
- Select the quantity of images you want to generate
