
# Course Selling App Backend

## Description
This backend is built using Node.js, Express, and MongoDB. It provides JWT-based authentication, admin functionality for course management, and secure user data handling with MongoDB. Mongoose is used for database management, and dotenv is used for securing sensitive data.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/YashMakkar7/Course-Selling-Backend.git
   ```

2. Navigate into the project directory:
   ```bash
   cd course-selling-app-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## API Testing with Postman
Use Postman to test the following endpoints:
1. User Signup: `POST /signup`
2. User Signin: `POST /signin`
3. Admin Add Course: `POST /admin/course`
4. User Purchase Course: `POST /purchase`

## Project Contributors
- Yash Makkar

