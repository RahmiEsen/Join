# 📌 Join – A Kanban Project Management Tool

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/) [![Angular CDK](https://img.shields.io/badge/Angular%20CDK-616161?style=for-the-badge&logo=angular&logoColor=white)](https://material.angular.io/cdk) [![Tiptap](https://img.shields.io/badge/Tiptap-0D0D0D?style=for-the-badge&logo=tiptap&logoColor=white)](https://tiptap.dev/)

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/) [![JSON Web Tokens](https://img.shields.io/badge/JSON%20Web%20Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

> **Join** is a modern, Trello-inspired Kanban tool built with **Angular** and **NestJS**.
> It helps individuals and teams **organize tasks**, **visualize workflows**, and **collaborate efficiently** – with a strong focus on clean architecture, interactivity, and a polished user experience.

![Join Kanban Board Preview](Frontend/src/assets/images/board/flow-01-overview.jpg)

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

A complete and secure workflow for user management ensures a smooth and safe onboarding experience. The system includes standard registration, Google OAuth, guest access, and a full password reset flow.

| Login Page | Sign Up Page |
| :---: | :---: |
| ![Login Page](Frontend/src/assets/images/auth/login.jpg) | ![Sign Up Page](Frontend/src/assets/images/auth/signup.jpg) |

#### Seamless Password Reset Flow
The application features a complete, user-friendly, and secure process for password recovery, illustrated below:

<table>
  <tr>
    <td align="center"><strong>1. Login Error & Request</strong></td>
    <td align="center"><strong>2. Email Confirmation</strong></td>
    <td align="center"><strong>3. Received Email</strong></td>
  </tr>
  <tr>
    <td width="33%"><img src="Frontend/src/assets/images/auth/login-error.jpg" alt="Login Error with Forgot Password Link"></td>
    <td width="33%"><img src="Frontend/src/assets/images/auth/reset-email-sent.jpg" alt="Email Sent Confirmation"></td>
    <td width="33%"><img src="Frontend/src/assets/images/auth/reset-email.jpg" alt="Password Reset Email"></td>
  </tr>
  <tr>
    <td align="center">A "Forgot Password?" link appears after a failed login attempt.</td>
    <td align="center">The user is notified that a reset email has been sent.</td>
    <td align="center">The user receives a secure email with a link to reset their password.</td>
  </tr>
   <tr>
    <td align="center"><strong>4. New Password Form</strong></td>
    <td colspan="2" align="center"><strong>Process Complete</strong></td>
  </tr>
   <tr>
    <td><img src="Frontend/src/assets/images/auth/reset-password-form.jpg" alt="Form to enter a new password"></td>
    <td colspan="2">The user sets a new password, completing the secure reset cycle.</td>
  </tr>
</table>

</details>

<details open>
<summary><strong>📋 Interactive Kanban Board</strong></summary>

The core of Join is an interactive board that provides an intuitive, visual way to manage workflows, built with the power of the **Angular Component Dev Kit (CDK)**. The following workflow demonstrates the core interactions.

---

### Board Interaction Workflow

<table>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/board/flow-02-drag-list.jpg" alt="Reordering lists with drag and drop" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>1. Reorder Lists via Drag & Drop</h3>
      <p>Users can intuitively change the order of the lists to match their workflow.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <h3>2. Use the List Context Menu</h3>
      <p>Alternatively, each list provides a context menu for more precise actions.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/board/flow-03-list-menu.JPG" alt="List Context Menu" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/board/flow-04-move-list-menu.jpg" alt="Moving a list to a specific position using the menu" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>3. Move a List via Menu</h3>
      <p>From the menu, users can move a list to a specific position, which is ideal for touch devices.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <h3>4. Add a New List</h3>
      <p>New columns can be added directly on the board via an inline form.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/board/flow-05-add-list.jpg" alt="Adding a new list to the board" width="100%">
    </td>
  </tr>
    <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/board/flow-08-add-card.jpg" alt="Adding a new card to a list" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>5. Add a New Card</h3>
      <p>Quick-add forms within each list allow for the fast creation of new tasks.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <h3>6. Move Cards via Drag & Drop</h3>
      <p>A card's status is updated by simply dragging it to a new list.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/board/flow-06-drag-card.jpg" alt="Moving a card between lists with drag and drop" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/board/flow-09-card-menu.jpg" alt="Context menu on a card" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>7. Use the Card Context Menu</h3>
      <p>Each card also has its own menu for quick actions like moving or deleting.</p>
    </td>
  </tr>
    <tr>
    <td width="50%" valign="middle">
      <h3>8. Move or Delete a Card</h3>
      <p>The menu allows for precise control over a card's position or for its deletion.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/board/flow-12-delete-card-menu.jpg" alt="Deleting a card via its menu" width="100%">
    </td>
  </tr>
</table>

</details>

<details open>
<summary><strong>📝 The Feature-Rich Task Editor</strong></summary>

Clicking a task opens a powerful modal editor that offers granular control over every detail. This editor is not just a form, but a collection of highly interactive and feature-complete components designed for a seamless user experience.

---

### 🎨 Cover Customization Workflow

The editor allows for rich visual customization of each task card through an intuitive cover menu.

<table>
  <tr>
    <td width="50%" valign="middle">
      <h3>1. Opening the Cover Menu</h3>
      <p>The journey begins by opening the task. A dedicated button in the header opens the cover menu, presenting all customization options.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-cover-menu.JPG" alt="Opening the Cover Menu" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-cover-color.JPG" alt="Selecting a solid color for the cover" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>2. Applying a Solid Color</h3>
      <p>Users can choose from a vibrant palette of solid colors to categorize or highlight a task. The change is instantly reflected in the header.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <h3>3. Choosing a Stock Photo</h3>
      <p>A curated library of professional stock photos is available to give tasks a more visual and descriptive background.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-cover-image-stock.JPG" alt="Selecting a stock photo for the cover" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-cover-image-upload.JPG" alt="Using an uploaded image as a cover" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>4. Using Uploaded Attachments</h3>
      <p>Any image previously uploaded to the task is available in the "Attachments" section and can be reused as a cover with a single click.</p>
    </td>
  </tr>
</table>

---

### ⚙️ Managing Task Details

The editor provides a suite of modular tools to manage labels, dates, members, and sub-tasks.

<table>
  <tr>
    <td width="50%" valign="middle">
      <h3>1. Full Label Management</h3>
      <p>An integrated tool allows users to create, edit, delete, and assign colored labels from a feature-rich dropdown menu.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-labels-edit.JPG" alt="Editing or creating a new label" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-date-picker.JPG" alt="Custom date picker for start and due dates" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>2. Custom Date Picker</h3>
      <p>A custom-built, interactive calendar component provides an intuitive way to select a start date, a due date, or a date range.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <h3>3. Member Assignment</h3>
      <p>Team members can be easily assigned to a task by selecting them from a clean, searchable list of all project contacts.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-members-select.JPG" alt="Assigning members from a contact list" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-checklist-add-item.JPG" alt="Adding a new sub-task to a checklist" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>4. Interactive Checklists</h3>
      <p>Break down tasks into smaller, manageable sub-tasks. New items can be added via a simple inline form.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <h3>5. Checklist Progress Tracking</h3>
      <p>As items are completed, a color-coded progress bar and percentage display provide immediate visual feedback on the checklist's status.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-checklist-progress.JPG" alt="Checklist showing progress bar and completed items" width="100%">
    </td>
  </tr>
</table>

---

### ✍️ Rich Text Editor Workflow (Tiptap.dev)

A complete rich text editor is integrated for task descriptions, offering a wide range of powerful formatting options.

<table>
  <tr>
    <td width="50%" valign="middle">
      <h3>1. Headings & Structure</h3>
      <p>Users can structure their content with a full range of heading levels from H1 to H6, or revert to normal paragraph text.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-richtext-headings.JPG" alt="Selecting a heading level from the toolbar" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-richtext-case-transform.JPG" alt="Advanced text case transformation options" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>2. Advanced Text Transformation</h3>
      <p>A unique and powerful feature allows for transforming selected text to UPPERCASE, lowercase, Capitalized, and more.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <h3>3. Text Color & Highlighting</h3>
      <p>Extensive color palettes for both font color and background highlighting give users full creative control over the text appearance.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-richtext-highlight.JPG" alt="Highlighting text with a color from the palette" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/editor/editor-richtext-formatting.JPG" alt="Final formatted text with lists, styles, and an embedded image" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>4. Full Formatting Suite</h3>
      <p>The editor supports all standard formatting, including bold, italics, lists, and the ability to embed images directly within the description.</p>
    </td>
  </tr>
</table>

</details>

<details open>
<summary><strong>📇 Full-Fledged Contact Management</strong></summary>

Join includes a comprehensive contact management system with a dedicated responsive design, allowing for full CRUD functionality in an intuitive interface.

<table>
  <tr>
    <td width="50%" valign="middle">
      <h3>1. Organized Overview</h3>
      <p>The main view presents a clean, alphabetically sorted list of all contacts. The list is intelligently grouped by the first initial, making navigation through long lists effortless.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/contacts/contacts-overview.JPG" alt="Overview of the contact list" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/contacts/contacts-edit-modal.JPG" alt="Modal for editing a contact" width="100%">
    </td>
    <td width="50%" valign="middle">
      <h3>2. Create & Edit via Modal</h3>
      <p>A beautifully animated modal slides in for adding and editing contacts (from the side on desktop, from the bottom on mobile). It features a live preview for profile picture uploads and robust form validation.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="middle">
      <h3>3. Detailed View & Feedback</h3>
      <p>After creating or editing, the user is presented with the detailed contact view and a smooth success notification. The layout is a classic master-detail view on desktop and a screen-by-screen flow on mobile.</p>
    </td>
    <td width="50%" valign="middle">
      <img src="Frontend/src/assets/images/contacts/contacts-detail-view.JPG" alt="Detailed view of a single contact after an update" width="100%">
    </td>
  </tr>
</table>

</details>

<details open>
<summary><strong>🎨 Workspace Customization</strong></summary>

To enhance the user experience, Join includes a board personalization feature. The selected background is saved to the user's profile and is automatically applied upon their next login.

<table>
  <tr>
    <td align="center"><strong>1. Open Widget</strong></td>
    <td align="center"><strong>2. Select a Color</strong></td>
    <td align="center"><strong>3. Select an Image</strong></td>
  </tr>
  <tr>
    <td width="33%"><img src="Frontend/src/assets/images/backgrounds/background-main-menu.JPG" alt="The background changer widget"></td>
    <td width="33%"><img src="Frontend/src/assets/images/backgrounds/background-select-color.JPG" alt="Selecting a gradient color background"></td>
    <td width="33%"><img src="Frontend/src/assets/images/backgrounds/background-select-image.JPG" alt="Selecting a photo background"></td>
  </tr>
  <tr>
    <td align="center">An elegant, floating widget provides access to all options.</td>
    <td align="center">Choose from a modern palette of vibrant gradient backgrounds.</td>
    <td align="center">Or select from a curated library of high-quality images.</td>
  </tr>
</table>

</details>

<details open>
<summary><strong>📱 Responsive & Mobile-First Design</strong></summary>

The application is designed to be fully functional and user-friendly across all devices, demonstrating a deep understanding of responsive principles.

-   **Smart Layout Adaptation:** The UI intelligently adapts its layout for major components, such as the Kanban board (horizontal scroll), the contact page (master-detail vs. single screen), and editor modals (side-slide vs. bottom-slide).
-   **Optimized Touch Experience:** On mobile, drag-and-drop is strategically disabled in favor of context menus to ensure a smooth and conflict-free scrolling experience.

</details>

---

## 🛠 Technology Stack

-   **Frontend:** **Angular**
    -   Written in **TypeScript**, utilizing modern features like **Standalone Components**.
    -   **Reactive Forms** for robust and testable form logic.
    -   **Angular CDK** for professional drag-and-drop functionality and custom overlays.
    -   **Angular Router** for a seamless single-page application (SPA) experience.
-   **Backend:** **NestJS** + **Prisma** + **PostgreSQL**
-   **Authentication:** **JWT**
-   **Rich Text Editor:** **Tiptap.dev**
-   **Styling:** **SCSS** with a modular, component-based structure

---

## 👨‍💻 Author

**Rahmi Esen**

[![Portfolio](https://img.shields.io/badge/Portfolio-000?style=for-the-badge&logo=vercel&logoColor=white)](https://rahmiesen.de/) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rahmi-esen-574182310/) [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RahmiEsen)
