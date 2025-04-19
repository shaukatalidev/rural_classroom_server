# Rural Classroom Server

This is a Node.js application designed to support the backend services for the Rural Classroom project.

## Features

- MongoDB integration for data storage.
- JWT-based authentication.
- Email support for notifications and communication.

## Environment Variables

The following environment variables are required to run the application. Make sure to set them in your `.env` file:

```plaintext
MONGO_URI=<your_mongo_connection_string>
PASSWORD=<your_password>
JWT_SECRET_KEY=<your_jwt_secret_key>
EMAIL=<your_email>
DISPLAY_EMAIL=<your_display_email>
COMPANY=<your_company_name>
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/shaukatalidev/rural_classroom_server.git
cd rural-classroom-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the required environment variables.

4. Start the server:

```bash
npm start
```

## Usage

- Access the API at `http://localhost:3000` (default port).
- Use tools like Postman or cURL to interact with the endpoints.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
