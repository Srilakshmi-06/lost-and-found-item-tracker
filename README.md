# Digital Lost and Found Platform

A production-ready full-stack web application designed for campus communities to report and match lost personal items using smart algorithms.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login.
- **Item Reporting**: Report lost or found items with images and categories.
- **Smart Matching**: Automated algorithm to find potential matches based on tags, location, and date.
- **Image Upload**: Seamless integration with Multer and Cloudinary for cloud image storage.
- **Dynamic Gallery**: Responsive UI with search and filtering capabilities.
- **User Dashboard**: Manage your own reports and track matches.

## 🧱 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Storage**: Cloudinary (via Multer).

## 🛠️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### 1. Clone & Install
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Application
From the root directory:
```bash
npm run start
```
- Backend will run on `http://localhost:5000`
- Frontend will run on `http://localhost:5173`

## 📊 Matching Algorithm
The platform uses a weighted scoring system:
- **Tag Match (50%)**: Common keywords in title and description.
- **Location Match (30%)**: Proximity of the reported location.
- **Date Proximity (20%)**: Closeness of the event date.

## 📁 Project Structure
- `/client`: React application (Vite)
- `/server`: Express.js API (MVC Architecture)
- `/server/utils`: Contains Tagging and Matching logic.
