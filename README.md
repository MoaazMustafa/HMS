<!-- README-AI-SIGNATURE:20260329025259 -->
# HMS

HMS (Health Management System) is a comprehensive application designed to streamline healthcare management processes. Built with TypeScript and Next.js, it offers a robust framework for managing various aspects of health administration efficiently.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

## ✨ Key Features

### 📊 Data Management
- Efficiently manage patient records and health data.
- Utilize Prisma for seamless database interactions.

### 📧 Email Notifications
- Integrated email setup for notifications using Nodemailer.
- Support for free SMTP services.

### 🛠️ Admin Dashboard
- Comprehensive admin dashboard for monitoring and managing system operations.
- Quick start and detailed guides available for administrators.

### 📅 Scheduling
- Features for scheduling appointments and managing nurse panels.
- Quick reference guides for nurses to enhance workflow.

## 🏗️ Project Structure

```
HMS/
├── .github/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── *.svg
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

To get started with the HMS project, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/MoaazMustafa/HMS.git
   cd HMS
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:3000`.

## 📜 Scripts

The following scripts are available for managing the project:

- **Development**: `npm run dev` - Start the development server.
- **Build**: `npm run build` - Build the application for production.
- **Start**: `npm run start` - Start the production server.
- **Lint**: `npm run lint` - Lint the codebase.
- **Format**: `npm run format` - Format the code using Prettier.
- **Database Operations**:
  - `npm run db:generate` - Generate Prisma client.
  - `npm run db:migrate` - Run database migrations.
  - `npm run db:seed` - Seed the database with initial data.

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
