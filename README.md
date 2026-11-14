
# 📚 BookNook – A Small Online Library

BookNook is a modern, responsive book-sharing and borrowing platform where readers can discover books, share their collections, and manage their reading journey in one place.

The application provides a seamless user experience with secure authentication, book management, borrowing functionality, and a beautiful interface with Light and Dark Mode support.

## 🌐 Live Website

**Live Site:** https://booknook-lake.vercel.app

## ✨ Key Features

- 📖 **Explore Books:** Browse a collection of books with detailed information, including title, author, category, description, and available copies.
- 🔐 **Secure Authentication:** Sign up, sign in, and sign out using Better Auth with email/password and Google authentication.
- ➕ **Add Books:** Authenticated users can add new books to the library and share them with other readers.
- 📚 **My Books:** Users can view, update, and delete books they have added to the platform.
- 🔖 **Borrow Books:** Readers can borrow available books and track their borrowing records.
- 🔄 **Return Books:** Users can return borrowed books through their personal borrowing dashboard.
- 🔍 **Search and Filter:** Easily find books using search, category filters, and sorting options.
- 🌙 **Light and Dark Mode:** Switch between light and dark themes for a comfortable reading experience.
- 📱 **Responsive Design:** Fully responsive interface optimized for mobile, tablet, and desktop devices.

## 🛠️ Technologies Used

### Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Lucide React
- React Toastify
- Swiper.js

### Authentication
- Better Auth
- JWT Authentication
- Google OAuth

### Backend Integration
- Node.js
- Express.js
- MongoDB
- REST API

### Deployment
- Vercel
- GitHub

## 📄 Main Pages

| Page | Description |
|------|-------------|
| Home | Landing page with featured books and categories |
| All Books | Browse, search, filter, and sort books |
| Book Details | View detailed information about a book |
| Sign In | Secure user login |
| Sign Up | Create a new user account |
| Add Book | Add a book to the collection |
| My Books | Manage personally added books |
| My Borrowings | Track and return borrowed books |
| Profile | View account details and access library features |

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tonmoybiswas07/BookNook
```

### 2. Navigate to the Project Directory

```bash
cd YOUR_PROJECT_FOLDER
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and configure the environment variables required by your application.

Example:

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=YOUR_SECRET
```

Additional authentication, database, and JWT environment variables may be required depending on your configuration.

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🔒 Authentication and Security

BookNook uses Better Auth for user authentication and JWT-based authorization for protected API operations.

- Secure email and password authentication
- Google OAuth login
- Protected user-specific pages
- JWT verification for protected backend endpoints
- User-specific book and borrowing management

## 🎨 User Interface

BookNook focuses on providing a modern and accessible user experience through:

- Clean and modern UI components
- Smooth transitions and animations
- Responsive navigation
- Interactive book cards
- Loading and empty states
- User-friendly notifications
- Light and Dark Mode support
- Custom 404 page

## 🎯 Project Purpose

The goal of BookNook is to create a user-friendly digital library platform where book lovers can share books, discover new stories, and manage their personal collections and borrowing activities efficiently.

This project demonstrates full-stack web development concepts, including authentication, REST API integration, CRUD operations, responsive design, and deployment.

## 👨‍💻 Developer

**Tonmoy Biswas**

MERN Stack Developer | Frontend Developer

**GitHub:** https://github.com/tonmoybiswas07

---

⭐ If you find this project useful, consider giving the repository a star!

**BookNook — Every Story Deserves a Home.**
