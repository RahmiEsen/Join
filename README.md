# 📌 Join – A Kanban Project Management Tool  

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)    [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)    [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)    [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)    [![Sass](https://img.shields.io/badge/Style-SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)    [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)  

> **Join** is a modern, Trello-inspired Kanban tool built with **Angular** and **NestJS**.  
It helps individuals and teams **organize tasks**, **visualize workflows**, and **collaborate efficiently** – with a strong focus on clean architecture, interactivity, and user experience.  

---

## 🚀 Live Demo  

👉 [Insert Live Demo Link Here](https://join.rahmiesen.de/auth/login)  

📷 *Place a screenshot of the landing/authentication page here (login, register, guest access).*  

---

## 📑 Table of Contents  

- [✨ Key Features](#-key-features)  
- [🛠 Technology Stack](#-technology-stack)  
- [⚡ Getting Started](#-getting-started)  
- [👨‍💻 Author](#-author)  
- [📜 License](#-license)  

---

## ✨ Key Features  

### 🔑 Authentication System  
- Standard login & registration (email + password)  
- Google OAuth 2.0 (one-click login)  
- Guest Access (explore without registration)  
- Password reset flow via secure token + email  
- “Remember Me” with `localStorage`  

📷 *Screenshot: Login & Registration UI.*  

---

### 📋 Kanban Board (Angular CDK)  
- **Drag & Drop** for tasks and lists  
- **List Management**: Create, delete, rename, reorder  
- **Task Cards** with members, labels, due dates, checklists  

📷 *Screenshot: Full Kanban board with lists & tasks.*  

---

### 📝 Task Editor Modal  

#### 🎨 Rich Text Editor (Tiptap.dev)  
- Headings, bold, italic, underline, lists  
- Text colors & highlights  
- Transformations (UPPERCASE / lowercase / Capitalized)  
- Embed images & files  

#### ✅ Subtasks via Checklists  
- Multiple checklists with progress bar  
- Hide completed items  

#### 🎴 Task Covers  
- Colors, stock photos, uploads, attachments  

#### 🏷 Labels  
- Create, edit, delete, assign  

#### 📅 Dates  
- Custom date picker (start, due, range)  

#### 👥 Members  
- Assign one or more users  

📷 *Screenshot: Task modal editor with description, checklist, and labels.*  

---

### 📱 Responsive & Mobile Design  
- Adaptive layout for mobile (horizontal scroll for lists)  
- Optimized touch experience (menus instead of drag & drop)  
- Works seamlessly across **desktop, tablet, and phone**  

📷 *Screenshot: Mobile view of the board.*  

---

## 🛠 Technology Stack  

- **Frontend:** Angular (Standalone Components, Reactive Forms, Angular CDK, Angular Router)  
- **Backend:** NestJS + Prisma + PostgreSQL  
- **Authentication:** JWT (stored in `localStorage`)  
- **Rich Text Editor:** Tiptap.dev  
- **Styling:** SCSS with modular structure  

---

## 👨‍💻 Author  

**Rahmi Esen**  

[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=vercel&logoColor=white)](https://rahmiesen.de/)    [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rahmi-esen-574182310/)    [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RahmiEsen)  


---

## 🖼️ Screenshot Guide  

1. **Live Demo:** Auth screen (Login/Register/Guest).  
2. **Authentication:** Focus on password reset & login.  
3. **Kanban Board:** Full board with lists & tasks.  
4. **Task Editor:** Open modal showing description & checklist.  
5. **Mobile View:** Board on a phone screen.  
