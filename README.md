# 📌 Join – A Kanban Project Management Tool

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Sass](https://img.shields.io/badge/Style-SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)  [![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/) 
> **Join** is a modern, Trello-inspired Kanban tool built with **Angular** and **NestJS**.
> It helps individuals and teams **organize tasks**, **visualize workflows**, and **collaborate efficiently** – with a strong focus on clean architecture, interactivity, and a polished user experience.

![Join Kanban Board Preview](URL_ZUM_HAUPTBILD_HIER_EINFUEGEN)

---

## 🚀 Live Demo

👉 **[join.rahmiesen.de](https://join.rahmiesen.de/auth/login)**

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠 Technology Stack](#-technology-stack)
- [👨‍💻 Author](#-author)

---

## ✨ Key Features

<details open>
<summary><strong>🔑 Comprehensive Authentication System</strong></summary>

A complete and secure workflow for user management ensures a smooth and safe onboarding experience, featuring:

-   **Standard Registration & Login:** Users can create an account and log in securely with an email and password, powered by a robust real-time validation system.
-   **Google OAuth 2.0:** Convenient one-click sign-in using existing Google accounts via a secure backend flow.
-   **Guest Access:** A "Guest Login" feature allows new users to explore the application's core functionality without needing to register.
-   **Full Password Reset Flow:** A secure, token-based process for users to request a password reset link via email and update their credentials.
-   **"Remember Me" Functionality:** Persists the user's email in `localStorage` for faster future logins.

![Authentication UI](URL_ZUM_AUTH_BILD_HIER_EINFUEGEN)

</details>

<details open>
<summary><strong>📋 Interactive Kanban Board</strong></summary>

The core of Join is an interactive board that provides an intuitive, visual way to manage workflows, built with the power of the **Angular Component Dev Kit (CDK)**.

-   **Full Drag & Drop Functionality:**
    -   **Reorder Columns:** Horizontally drag and drop entire task lists to customize the workflow.
    -   **Move Tasks:** Vertically drag and drop tasks within a list to reprioritize, or move them between lists to update their status. All position changes are persisted in the backend.
-   **Complete List (Column) Management:**
    -   **Inline Title Editing:** Simply click on a list's title to edit it on the fly.
    -   **Context Menus:** In addition to drag-and-drop, lists can be precisely moved or deleted via a dedicated context menu, ensuring full functionality on touch devices.

</details>

<details open>
<summary><strong>📝 The Feature-Rich Task Editor</strong></summary>

Clicking a task opens a powerful modal editor that offers granular control over every detail, showcasing a highly modular and feature-complete design.

#### 🎨 Full-Fledged Rich Text Editor (Tiptap.dev)
A complete rich text editor is built-in for task descriptions, offering:
-   **Advanced Formatting:** Headings (H1-H6), bold, italic, underline, strikethrough, and bulleted or numbered lists.
-   **Text Color & Highlighting:** Multiple color palettes for both font color and background highlighting.
-   **Advanced Text Transformation:** Unique tools to transform selected text (e.g., to `UPPERCASE`, `lowercase`, or `Capitalize Each Word`).
-   **Image & File Embedding:** Upload and embed images directly into the description.

#### ✅ Sub-Tasks via Interactive Checklists
-   Add multiple checklists to any task, each with an editable title and full CRUD functionality for items.
-   A **color-coded progress bar** and percentage text visualize the completion status in real-time.
-   Completed items can be hidden to maintain focus on open tasks, enhancing clarity.

#### 🎴 Extensive Cover Customization
-   Visually categorize tasks with a cover, managed via a detailed menu with options for a rich color palette, a gallery of professional stock photos, or custom image uploads.

#### 🏷 Full Label Manager & Custom Date Picker
-   An integrated tool to create, edit, delete, and assign colored labels to tasks.
-   A **custom-built calendar component** allows for selecting a start date, a due date, or a date range with an intuitive UI.

#### 👥 Member Assignment & Interactive Selections
-   Assign one or more team members to a task from the contact list.
-   All selections (labels, dates, members) are displayed as interactive pills below the toolbar. Clicking a selection re-opens its respective editor, creating a fast and intuitive workflow.

![Task Editor Modal](URL_ZUM_EDITOR_BILD_HIER_EINFUEGEN)

</details>

<details open>
<summary><strong>📇 Full-Fledged Contact Management</strong></summary>

Join includes a comprehensive contact management system with a dedicated responsive design.

-   **Full CRUD Functionality:** Users can Create, Read, Update, and Delete contacts through a seamless and intuitive interface.
-   **Organized & Grouped List:** Contacts are automatically sorted alphabetically and grouped by their first initial, making navigation effortless.
-   **Dedicated Responsive Design:**
    -   **Desktop:** A classic two-panel "master-detail" layout shows the contact list on the left and the selected contact's details on the right with a smooth slide-in animation.
    -   **Mobile/Tablet:** The interface transforms into a native-app-like screen-by-screen flow, utilizing a floating action button (FAB) and context menus for a clean, touch-friendly experience.
-   **Create & Edit via Responsive Modal:** A beautifully animated modal slides in for adding and editing contacts (from the **side on desktop**, from the **bottom on mobile**), featuring a live preview for profile picture uploads.

![Contacts Page](URL_ZUM_KONTAKTE_BILD_HIER_EINFUEGEN)

</details>

<details open>
<summary><strong>🎨 Workspace Customization</strong></summary>

To enhance the user experience, Join includes a board personalization feature.

-   **Persistent User Choice:** The selected background is saved to the user's profile and is automatically applied upon their next login.
-   **Interactive Widget:** Customization is handled via an elegant, animated floating widget that expands to reveal options without interrupting the workflow.
-   **Rich Library:** Users can choose from a curated library of high-quality images or a modern palette of vibrant gradient backgrounds.

</details>

<details open>
<summary><strong>📱 Responsive & Mobile-First Design</strong></summary>

The application is designed to be fully functional and user-friendly across all devices, demonstrating a deep understanding of responsive principles.

-   **Smart Layout Adaptation:** The UI intelligently adapts its layout for major components, such as the Kanban board (horizontal scroll), the contact page (master-detail vs. single screen), and editor modals (side-slide vs. bottom-slide).
-   **Optimized Touch Experience:** On mobile, drag-and-drop is strategically disabled in favor of context menus to ensure a smooth and conflict-free scrolling experience.

![Mobile Responsive View](URL_ZUM_MOBILE_BILD_HIER_EINFUEGEN)

</details>

---

## 🛠 Technology Stack

-   **Frontend:** **Angular**
    -   Written in **TypeScript**, utilizing modern features like **Standalone Components**.
    -   **Reactive Forms** for robust and testable form logic.
    -   **Angular CDK** for professional drag-and-drop functionality and custom overlays.
    -   **Angular Router** for a seamless single-page application (SPA) experience.
-   **Backend:** **NestJS** + **Prisma** + **PostgreSQL**
-   **Authentication:** **JWT** (stored in `localStorage`)
-   **Rich Text Editor:** **Tiptap.dev**
-   **Styling:** **SCSS** with a modular, component-based structure

---

## 👨‍💻 Author

**Rahmi Esen**

[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=vercel&logoColor=white)](https://rahmiesen.de/) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rahmi-esen-574182310/) [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RahmiEsen)
