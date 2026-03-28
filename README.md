<!-- README-AI-SIGNATURE:20260328002113 -->
# HMS

HMS (Health Management System) is a comprehensive application designed to streamline healthcare management processes. Built with TypeScript and Next.js, it offers a robust framework for developing scalable and efficient health management solutions.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

## ✨ Key Features

### 📊 Data Management
- Utilizes Prisma for seamless database interactions.
- Supports data seeding and migrations for efficient database management.

### 🛠️ Development Tools
- Integrated ESLint and Prettier for code quality and formatting.
- Scripts for linting, formatting, and type-checking to maintain code standards.

### 📧 Email Functionality
- Configured with Nodemailer for email notifications and communications.
- Includes guides for setting up SMTP services.

## 🏗️ Project Structure

```
HMS/
├── .github/
│   └── copilot-instructions.md
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── middleware.ts
│   └── styles/
├── public/
│   ├── file.svg
│   └── globe.svg
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

To get started with the HMS project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/MoaazMustafa/HMS.git
   cd HMS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts

The following scripts are available for managing the project:

- **Development**: `npm run dev` - Start the development server.
- **Build**: `npm run build` - Build the application for production.
- **Lint**: `npm run lint` - Lint the codebase.
- **Format**: `npm run format` - Format the codebase using Prettier.
- **Database Operations**:
  - `npm run db:generate` - Generate Prisma client.
  - `npm run db:migrate` - Run database migrations.
  - `npm run db:seed` - Seed the database with initial data.

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
