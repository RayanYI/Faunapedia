# 🦁 Faunapedia - The Social Animal Encyclopedia

**Faunapedia** is a hybrid platform combining a collaborative animal encyclopedia with social network features. Users can browse animal species and share their own photos to contribute to the gallery.

![Faunapedia Cover](https://plus.unsplash.com/premium_photo-1661877753653-755a71abd411?auto=format&fit=crop&w=1200&q=80)

## 🚀 Key Features

*   **📖 Animal Encyclopedia**: Explore detailed fact sheets (Lion, Elephant, Wolf, etc.) with scientific names and descriptions.
*   **📸 Social Sharing**: Post your own animal photos with captions.
*   **🏷️ Categorization**: Filter animals by Mammals, Birds, Reptiles, etc.
*   **🔐 Authentication**: Secure User Sign-up/Login powered by Clerk.
*   **☁️ Cloud Storage**: Secure image uploads via AWS S3 (Presigned URLs).
*   **📱 Responsive UI**: Modern, responsive interface built with Tailwind CSS.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
*   **Authentication**: [Clerk](https://clerk.com/)
*   **Storage**: [AWS S3](https://aws.amazon.com/s3/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/faunapedia.git
cd faunapedia
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/faunapedia

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# AWS S3 STORAGE
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-3
AWS_BUCKET_NAME=your-bucket-name
```

### 3. Seed the Database
Populate your local database with initial animal species:
```bash
npm run dev
# Then open a separate terminal and run:
curl http://localhost:3000/api/seed
```

### 4. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```
├── src
│   ├── app          # Next.js App Router Pages & API
│   ├── actions      # Server Actions (Backend Logic)
│   ├── components   # React Components (UI)
│   ├── lib          # Utilities (Mongoose, S3 Client)
│   ├── models       # Mongoose Schemas (User, Animal, Post)
│   └── types        # TypeScript Interfaces
└── public           # Static assets
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License
This project is licensed under the MIT License.
