
# User Registration & Management System

**Next.js Developer Skill Assessment**

## 📌 Project Overview

This project is a **User Registration and Management System** built using **Next.js App Router**.
It was developed as part of a technical assessment to demonstrate skills in:

* Next.js fundamentals
* Form handling & validation
* Database integration
* Image uploads
* Basic session-based access control
* CRUD operations

The application allows users to register with profile details, view a list of registered users, delete users, and logout using a simple session mechanism.

---

## 🚀 Features Implemented

### ✅ Registration Page

* Fields:

  * Full Name
  * Email ID
  * Phone Number
  * Profile Picture (Image Upload)
* Validations:

  * All fields are mandatory
  * Email format validation
  * Phone number numeric validation
  * Unique email check
  * Only image files allowed
* Profile image upload using **Cloudinary**
* Redirects to user list page after successful registration

---

### ✅ User List Page (Dashboard)

* Displays all registered users in a table
* Each row includes:

  * Profile picture thumbnail
  * Full name
  * Email
  * Phone number
  * Delete button
* Delete user functionality with instant UI update
* Logout button available

---

### ✅ Session-Based Access Control (No Login)

* Uses a **cookie-based session API**
* Access to dashboard is allowed only after registration
* Logout clears session and redirects to registration page
* No login or password system implemented (as per requirements)

---

## 🛠️ Tech Stack

| Technology               | Usage            |
| ------------------------ | ---------------- |
| **Next.js (App Router)** | Framework        |
| **TypeScript**           | Type safety      |
| **MongoDB + Mongoose**   | Database         |
| **Cloudinary**           | Image storage    |
| **Tailwind CSS**         | Styling          |
| **Zod**                  | Form validation  |
| **Cookies API**          | Session handling |

---

## 📂 Project Structure

```
app/
├── api/
│   ├── users/
│   │   ├── route.ts
│   ├── upload/
│   │   ├── route.ts
│   ├── session/
│   │   ├── route.ts
│
├── registration/
│   ├── page.tsx
│
├── users/
│   ├── page.tsx
│
├── components/
│   ├── RegistrationForm.tsx
│   ├── UserTable.tsx
│
lib/
├── db.ts
├── cloudinary.ts
├── models/
│   ├── User.ts
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGO_URI=mongodb://localhost:27017/user_management_system

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ Never commit `.env.local` to GitHub.

---

## 🧪 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/user-management-nextjs.git
cd user-management-nextjs
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run MongoDB locally

Ensure MongoDB is running on your system:

```bash
mongod
```

### 4️⃣ Start the development server

```bash
npm run dev
```

Open:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔄 Application Flow

1. User lands on **Registration Page**
2. Fills form and uploads profile image
3. Image uploads to Cloudinary
4. User data saved to MongoDB
5. Session cookie is created
6. Redirect to **User List Page**
7. User can:

   * View registered users
   * Delete users
   * Logout
8. Logout clears session and redirects back to registration

---

## 🧠 Key Notes

* No authentication or login system used (as per requirement)
* Session is managed using HTTP-only cookies
* Email uniqueness enforced at database level
* App Router and Server Components used properly
* Code is modular and readable

---

## 📦 Submission Details

* **Framework:** Next.js (App Router)
* **Database:** MongoDB
* **Language:** TypeScript
* **Status:** Completed within the given time constraint

---

## 👤 Author

**Muhammed Salih PK**
Frontend / Full Stack Developer
GitHub: [https://github.com/Muhammed-Salih-PK](https://github.com/Muhammed-Salih-PK)

---

If you want, I can also:

* Make this README **more recruiter-friendly**
* Add **screenshots section**
* Add **API documentation**

Just tell me 👍
