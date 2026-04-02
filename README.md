<!-- README-AI-SIGNATURE:20260402024502 -->
# HMS

HMS (Health Management System) is a comprehensive application designed to streamline healthcare management processes. Built with TypeScript and Next.js, it offers a robust platform for managing various healthcare-related tasks efficiently.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

## ✨ Key Features

### 🏥 Admin Dashboard
- Comprehensive dashboard for managing healthcare operations.
- User-friendly interface for quick access to essential features.

### 📧 Email Setup
- Integrated email functionality using Nodemailer for notifications and alerts.
- Support for free SMTP services to facilitate email communication.

### 📊 Data Management
- Efficient data handling with Prisma for database interactions.
- Easy database migrations and seeding for development and production environments.

### 🛠️ Quick Start Guides
- Detailed documentation for quick setup and deployment.
- Step-by-step guides for both admin and nurse panels.

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
- **Lint**: `npm run lint` - Run ESLint to check for code quality.
- **Format**: `npm run format` - Format the code using Prettier.
- **Database Migrate**: `npm run db:migrate` - Apply database migrations.

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
