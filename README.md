# 🧪 Mad Scientist's Inventory

A simple inventory management app for tracking lab items like radioactive potions, alien artifacts, and experimental materials. No login required—anyone can add, update, or delete items.

## 🚀 Features

- **Inventory Management** – Add, edit, update, or remove items freely
- **Categorization** – Items are grouped into Categories like Chemistry, Robotics, Paranormal, etc.
- **Simple & Open** – No user accounts, easy access for all

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase
- **Frontend**: EJS, CSS

## 📦 Database Schema

### `items`

| Column           | Type         | Description                          |
| ---------------- | ------------ | ------------------------------------ |
| `id`             | UUID (PK)    | Unique item identifier               |
| `name`           | VARCHAR(100) | Item name (unique)                   |
| `category`       | VARCHAR(50)  | Item category (e.g., Chemistry)      |
| `quantity`       | INTEGER      | Number of items available            |
| `created_at`     | TIMESTAMP    | Auto-generated timestamp             |
| `scientist_name` | VARCHAR(100) | Name of the scientist who created it |

### `scientists`

| Column  | Type         | Description                 |
| ------- | ------------ | --------------------------- |
| `id`    | UUID (PK)    | Unique scientist identifier |
| `name`  | VARCHAR(100) | Scientist's name            |
| `email` | VARCHAR(100) | Scientist's email (unique)  |

## 🚀 Setup & Run

```sh
git clone https://github.com/yourusername/mad-scientist-inventory.git
cd mad-scientist-inventory
npm install
nodemon server.js
```
