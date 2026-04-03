<!-- README-AI-SIGNATURE:20260403024829 -->
# HMS

HMS (Health Management System) is a comprehensive application designed to streamline healthcare management processes. Built with TypeScript and Next.js, it offers a robust platform for managing various healthcare-related tasks efficiently.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

## ✨ Key Features

### 🏥 Admin Dashboard
- Comprehensive management tools for administrators.
- Quick access to user analytics and system settings.

### 👩‍⚕️ Nurse Panel
- User-friendly interface for nurses to manage patient information.
- Quick reference guides and testing checklists for efficient workflow.

### 📧 Email Setup
- Integrated email functionality using Nodemailer for notifications and alerts.
- Free SMTP guide for easy configuration.

### 📊 Data Export Functionality
- Ability to export data for reporting and analysis.
- Supports various formats for flexibility in data handling.

## 🏗️ Project Structure

```
HMS/
├── .github/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── file.svg
│   └── globe.svg
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── styles/
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
- **Database Operations**:
  - `npm run db:generate` - Generate Prisma client.
  - `npm run db:migrate` - Run database migrations.

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
