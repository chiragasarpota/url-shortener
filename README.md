# Node.js Redis URL Shortener

## Introduction

This project is a URL shortening service built with Node.js and Redis. It provides a simple API for creating short URLs (redirects) and managing them. The service includes features such as key-value pair management, URL redirection, and basic API key authentication.

## Features

- **URL Redirection**: Redirect short URLs to their original URLs.

- **Key-Value Pair Management**: Add, update, and retrieve key-value pairs from Redis.

- **API Key Authentication**: Protected routes for managing key-value pairs.

## Prerequisites

- Node.js

- npm (Node.js package manager)

- Redis Server

## Installation

1.  **Clone the repository:**

```bash

git clone [repository URL]

cd [repository name]

npm install
```

2.  **Install dependencies:**

```bash
npm install
```

3.  **Set up environment variables:**

Create a `.env` file in the project root with the following contents:

```plaintext
REDIS_URL=redis://127.0.0.1:6379
API_KEY=your_secret_api_key_here
```

4. **Run Redis Server:**
   Make sure your Redis server is running. You can start Redis locally or use a Docker container.

## Usage

Start the server with:

```bash
node server.js
```

### API Endpoints

- **Create Short URL**: `POST /api/add`
- **Update URL**: `PUT /api/update`
- **Redirect**: `GET /:key`
- **Read All Key-Value Pairs**: `GET /read_all`

### Example

```bash
curl -X POST http://localhost:3000/api/add \
-H "Authorization: your_api_key" \
-H "Content-Type: application/json" \
-d '{"key": "example", "value": "https://www.example.com"}'
```

## Contributing

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.
