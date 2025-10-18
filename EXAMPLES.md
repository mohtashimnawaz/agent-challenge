# 📚 Example Scenarios

Real-world examples of using the Database Schema Designer.

## 🛍️ E-Commerce Platform

### Conversation
```
User: "Design an e-commerce schema with products, orders, and customers"

Agent: I'll create a comprehensive e-commerce schema for you.

[Creates tables: customers, products, orders, order_items]

User: "Add categories for products"

Agent: I'll add a categories table and link it to products.

[Creates categories table and adds relationship]

User: "Generate a MySQL migration"

Agent: Here's your MySQL migration script...
```

### Result
- **customers** (id, email, name, address, phone, created_at, updated_at)
- **categories** (id, name, description, created_at, updated_at)
- **products** (id, category_id, name, description, price, stock, created_at, updated_at)
- **orders** (id, customer_id, total, status, created_at, updated_at)
- **order_items** (id, order_id, product_id, quantity, price, created_at, updated_at)

**Relations:**
- categories → products (one-to-many)
- customers → orders (one-to-many)
- orders → order_items (one-to-many)
- products → order_items (one-to-many)

---

## 📱 Social Media App

### Conversation
```
User: "I need a schema for a social media app with users, posts, likes, and follows"

Agent: I'll design a social media schema with those features.

[Creates users, posts, likes, follows tables]

User: "Add comments on posts"

Agent: Adding a comments table with relationship to posts and users.

[Creates comments table with relationships]

User: "Validate the schema"

Agent: Validating your schema...
✅ Schema is valid!
💡 Suggestion: Consider adding indexes on foreign keys for better performance
```

### Result
- **users** (id, username, email, password, bio, avatar, created_at, updated_at)
- **posts** (id, user_id, content, image_url, created_at, updated_at)
- **comments** (id, post_id, user_id, content, created_at, updated_at)
- **likes** (id, post_id, user_id, created_at)
- **follows** (id, follower_id, following_id, created_at)

**Relations:**
- users → posts (one-to-many)
- users → comments (one-to-many)
- posts → comments (one-to-many)
- users → likes (one-to-many)
- posts → likes (one-to-many)
- users → follows (many-to-many via self-reference)

---

## 🎓 Learning Management System

### Conversation
```
User: "Create a schema for an online learning platform"

Agent: I'll design a comprehensive LMS schema. What features do you need?

User: "Courses, lessons, students, enrollments, and progress tracking"

Agent: Creating a complete LMS schema with those features...

[Creates multiple tables with relationships]

User: "Export as PostgreSQL"

Agent: Here's your PostgreSQL schema export...
```

### Result
- **students** (id, email, name, enrolled_date, created_at, updated_at)
- **instructors** (id, email, name, bio, created_at, updated_at)
- **courses** (id, instructor_id, title, description, price, created_at, updated_at)
- **lessons** (id, course_id, title, content, order, duration, created_at, updated_at)
- **enrollments** (id, student_id, course_id, enrolled_at, completed_at)
- **progress** (id, enrollment_id, lesson_id, completed, completed_at)

**Relations:**
- instructors → courses (one-to-many)
- courses → lessons (one-to-many)
- students → enrollments (one-to-many)
- courses → enrollments (one-to-many)
- enrollments → progress (one-to-many)
- lessons → progress (one-to-many)

---

## 🏥 Healthcare Appointment System

### Conversation
```
User: "Design a database for a healthcare appointment system"

Agent: I'll create a healthcare appointment schema. This will include patients, doctors, appointments, and medical records.

[Creates comprehensive healthcare schema]

User: "Add a table for prescriptions"

Agent: Adding prescriptions table linked to appointments and patients.

[Creates prescriptions table with relationships]

User: "Validate and check for HIPAA compliance considerations"

Agent: Validating schema...
✅ Schema is valid
⚠️ Warning: Consider adding encryption for sensitive medical data
💡 Suggestion: Add audit fields (created_by, updated_by) for compliance
```

### Result
- **patients** (id, name, email, phone, date_of_birth, address, created_at, updated_at)
- **doctors** (id, name, email, specialization, license_number, created_at, updated_at)
- **appointments** (id, patient_id, doctor_id, appointment_date, status, notes, created_at, updated_at)
- **medical_records** (id, patient_id, doctor_id, diagnosis, treatment, created_at, updated_at)
- **prescriptions** (id, appointment_id, patient_id, medication, dosage, duration, created_at, updated_at)

---

## 🎮 Gaming Leaderboard

### Conversation
```
User: "I'm building a game. I need players, scores, and achievements"

Agent: I'll design a gaming schema with players, scores, and achievements.

[Creates gaming schema]

User: "Add multiplayer matches and teams"

Agent: Adding matches and teams tables with proper relationships.

[Extends schema with multiplayer features]

User: "Generate SQLite migration"

Agent: Here's your SQLite migration for the gaming schema...
```

### Result
- **players** (id, username, email, level, experience, created_at, updated_at)
- **achievements** (id, name, description, points, icon, created_at)
- **player_achievements** (id, player_id, achievement_id, unlocked_at)
- **matches** (id, game_mode, started_at, ended_at, created_at)
- **match_scores** (id, match_id, player_id, score, rank, created_at)
- **teams** (id, name, created_at, updated_at)
- **team_members** (id, team_id, player_id, role, joined_at)

---

## 📊 Analytics Dashboard

### Conversation
```
User: "Create a schema for tracking website analytics"

Agent: I'll design an analytics schema for tracking user behavior and events.

[Creates analytics schema]

User: "Add support for A/B testing"

Agent: Adding experiments and variants tables for A/B testing.

[Extends schema with A/B testing support]
```

### Result
- **visitors** (id, session_id, ip_address, user_agent, created_at)
- **page_views** (id, visitor_id, page_url, referrer, duration, created_at)
- **events** (id, visitor_id, event_name, event_data, created_at)
- **conversions** (id, visitor_id, conversion_type, value, created_at)
- **experiments** (id, name, description, start_date, end_date, created_at)
- **variants** (id, experiment_id, name, traffic_percentage, created_at)
- **experiment_assignments** (id, visitor_id, experiment_id, variant_id, created_at)

---

## 💡 Tips for Best Results

### Be Specific
❌ "Create a database"
✅ "Create a blog schema with users, posts, and comments"

### Iterate Gradually
1. Start with core tables
2. Add relationships
3. Extend with additional features
4. Validate and refine

### Use Domain Language
- E-commerce: products, orders, customers
- Social: users, posts, likes, follows
- Healthcare: patients, appointments, records

### Ask for Validation
Always validate your schema before generating migrations:
```
"Validate my schema and suggest improvements"
```

### Export in Your Format
Specify your database when generating migrations:
```
"Generate a PostgreSQL migration"
"Export as MySQL"
"Show me SQLite syntax"
```

---

## 🎯 Advanced Patterns

### Many-to-Many Relationships
```
User: "Create a many-to-many relationship between students and courses"

Agent: I'll create an enrollments junction table to link students and courses.
```

### Self-Referencing Tables
```
User: "Add a manager field to employees that references other employees"

Agent: I'll add a self-referencing foreign key for the manager relationship.
```

### Polymorphic Relationships
```
User: "I need comments that can be on both posts and photos"

Agent: I'll create a polymorphic relationship using commentable_type and commentable_id fields.
```

### Soft Deletes
```
User: "Add soft delete support to all tables"

Agent: I'll add a deleted_at timestamp field to enable soft deletes.
```

---

Need more examples? Ask the agent - it's designed to help with any schema design challenge!
