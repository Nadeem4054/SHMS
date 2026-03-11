# Smart Hostel Management System

A complete full-stack MERN (MongoDB, Express, React, Node.js) application for managing hostel accommodations with separate portals for Students and Administrators.

## Features

### Landing Page
- Modern responsive design
- Hero section with call-to-action buttons
- Features showcase
- Hostel rules and regulations
- Room facilities information
- Contact form
- Footer with quick links

### Student Features
- Submit hostel application
- View application status
- Access assigned room details
- View personal profile
- View hostel rules and facilities

### Admin Features
- Dashboard with statistics
- Review and manage student applications
- Approve/reject applications with room assignment
- Create and manage rooms
- View approved students list
- Room occupancy tracking

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React.js with Vite
- React Router DOM
- Tailwind CSS
- Axios for API calls
- React Icons

## Project Structure

```
hostel/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── applicationController.js
│   │   ├── roomController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   └── StudentApplication.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── roomRoutes.js
│   │   └── studentRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── StudentLayout.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Apply.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── StudentApplications.jsx
│   │   │   │   ├── Rooms.jsx
│   │   │   │   └── ApprovedStudents.jsx
│   │   │   └── student/
│   │   │       ├── StudentDashboard.jsx
│   │   │       ├── MyRoom.jsx
│   │   │       └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd hostel
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-hostel
JWT_SECRET=your-secret-key-here
```

Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

### 4. Create Initial Admin User

Use the setup endpoint to create the first admin user:

```bash
curl -X POST http://localhost:5000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@hostel.com",
    "password": "admin123"
  }'
```

Or use the demo credentials provided in the login page.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/setup-admin` - Create initial admin

### Applications
- `POST /api/apply` - Submit student application
- `GET /api/admin/applications` - Get all applications (Admin)
- `PUT /api/admin/approve/:id` - Approve application (Admin)
- `PUT /api/admin/reject/:id` - Reject application (Admin)
- `GET /api/admin/approved-students` - Get approved students (Admin)

### Rooms
- `POST /api/admin/rooms` - Create room (Admin)
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/available` - Get available rooms

### Student
- `GET /api/student/my-room` - Get student's room
- `GET /api/student/profile` - Get student profile

## Usage Guide

### For Students
1. Visit the landing page and click "Apply Now"
2. Fill out the application form with all required details
3. Submit the application
4. Wait for admin approval
5. Once approved, login to view your assigned room

### For Administrators
1. Login with admin credentials
2. Navigate to "Student Applications" to review pending applications
3. Click "Approve" to assign a room to approved students
4. Click "Reject" to reject applications
5. Navigate to "Rooms" to add or manage hostel rooms
6. View "Approved Students" to see all approved students and their room assignments

## Demo Credentials

**Admin:**
- Email: admin@hostel.com
- Password: admin123
- (Create using the setup-admin endpoint first)

**Student:**
- Students are created automatically when their application is approved

## Features in Detail

### Application Status Flow
1. **Pending** - Application submitted, awaiting review
2. **Approved** - Application approved, room assigned, user account created
3. **Rejected** - Application rejected

### Room Management
- Create rooms with room number, floor, capacity, and hostel block
- Track occupancy in real-time
- View available beds in each room
- Assign rooms to approved students

### Security Features
- JWT-based authentication
- Protected routes for admin and student portals
- Role-based access control
- Password hashing with bcrypt

## Development Notes

- The backend uses CORS to allow requests from the frontend
- MongoDB connection string can be configured in the `.env` file
- JWT tokens expire after 30 days
- API responses include proper error handling
- Frontend uses React Context for user state management

## Troubleshooting

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or use MongoDB Atlas
   - Check the MONGODB_URI in the `.env` file

2. **CORS Error**
   - The backend is configured to accept requests from http://localhost:3000
   - Ensure both backend and frontend are running on correct ports

3. **Login Issues**
   - Create an admin user first using the setup-admin endpoint
   - Students can only login after their application is approved

## License

This project is created for educational purposes.
