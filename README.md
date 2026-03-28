<!-- README-AI-SIGNATURE:e0b902e62a1265a8 -->
```markdown
# HMS

A Health Management System built with TypeScript and Next.js.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)

## Key Features

- User authentication with NextAuth
- Admin and nurse dashboards
- Email setup and SMTP configuration
- Database management with Prisma
- Responsive design using Tailwind CSS

## Project Structure

```
.
├── .github/                  # GitHub-related files
├── prisma/                   # Prisma schema and seed files
├── public/                   # Static assets
├── src/                      # Source code
│   ├── app/                  # Application logic
│   ├── components/           # Reusable components
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utility functions
│   ├── middleware.ts         # Middleware functions
│   └── styles/               # CSS styles
├── .gitignore                # Git ignore file
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```

## Getting Started

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

3. Set up the database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

The following scripts are available in this project:

- `dev`: Start the development server with TurboPack.
- `build`: Build the application for production.
- `start`: Start the production server.
- `lint`: Lint the codebase using ESLint.
- `format`: Format the codebase using Prettier.
- `db:generate`: Generate Prisma client.
- `db:push`: Push the Prisma schema to the database.
- `db:migrate`: Run database migrations.
- `db:seed`: Seed the database with initial data.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
