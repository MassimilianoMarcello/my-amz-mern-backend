# MERN backend template

This repository provides a backend template for Node.js applications, structured for modularity and maintainability. It includes essential directories and files with specific purposes, enabling streamlined development and scalability.

## Project Structure

```plaintext
Project/
|-- config/
|   ├── db.js           # Database configuration (for setup if using a DB)
|-- controllers/
|   ├── user.js         # User-related business logic
|-- middleware/
|   ├── logger.js       # Middleware for logging requests and activities
|-- models/
|   ├── user.js         # User schema for MySQL or similar DB
|-- public/             # Public assets like CSS and images
|   ├── css/
|   ├── img/
|-- routes/
|   ├── user.js         # Defines routes for user-related endpoints
|-- utils/
|   ├── matchPasswords.js    # Utility for password comparison
|   ├── validateEmail.js     # Utility to validate email format
|   ├── validatePasswords.js # Utility for password complexity check
|
|-- .env                # Environment variables configuration
|-- index.js            # Main entry point of the application
|-- package.json        # Project dependencies and scripts
|-- README.md           # Documentation (this file)
```

## Directory & File Descriptions

### `config/`

- **db.js**: Placeholder for database configuration, typically used to connect to databases like MySQL or MongoDB.

### `controllers/`

- **user.js**: Houses logic for handling user-related operations (e.g., create, update, delete users).

### `middleware/`

- **logger.js**: Contains functions to log requests and other activities, supporting debugging and monitoring.

### `models/`

- **user.js**: Defines the schema for user data in a database, detailing fields and data types (if using a database).

### `public/`

- Contains publicly accessible assets, such as **CSS** and **images** used in front-end rendering.

### `routes/`

- **user.js**: Defines HTTP routes and maps them to controller functions, handling user-related API endpoints.

### `utils/`

- **matchPasswords.js**: Compares hashed passwords, assisting in authentication processes.
- **validateEmail.js**: Checks if email addresses meet a valid format.
- **validatePasswords.js**: Verifies password complexity requirements (e.g., length, special characters).

### Project Root Files

- **.env**: Stores sensitive configuration details (e.g., API keys, port numbers). This file should not be committed to version control.
- **index.js**: Entry point of the application; sets up the server, middleware, routes, and error handling.
- **package.json**: Contains project metadata, dependencies, and scripts for development.
- **README.md**: Project overview and structure details.

## Getting Started

Follow these steps to set up and run the project:

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Create a .env File**
   In the project root, create a `.env` file and add the necessary environment variables:

   ```plaintext
   PORT=5004
   CORS_ORIGINS=http://localhost:5173
   TOKEN_SECRET=YOUR_TOKEN_SECRET
   CONNECTION_URI=YOUR_CLUSTER_URI
   STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
   ```

3. **Run the Application**

   ```bash
   npm run dev
   ```

## Additional Notes

### Environment Variables

The `.env` file is essential for managing environment-specific settings. Sensitive information (e.g., API keys) should be stored here and kept out of version control to enhance security.

### Middleware

The `logger.js` middleware, and any additional middleware, can be added to `index.js` to extend application functionality, such as request logging and error handling.

### Utilities

Utility functions in the `utils/` directory help manage common tasks, such as email and password validation, promoting code reusability across the application.

### Git Ignore Recommendations

In `.gitignore`, ensure sensitive and environment-specific files are included:

- Uncomment `.env`, `logs`, and `.vscode` to keep them out of version control.
