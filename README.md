# Car Workshop Management System

A car workshop management system that enables car owners to register repairs, mechanics to manage tasks, and administrators to oversee all operations.

## Prerequisites

-   PHP >= 8.1
-   Composer
-   MySQL
-   Node.js & NPM

## Installation

1. Clone this repository:

```bash
git clone git@github.com:bagussuprapta/car-workshop-taksu-bagus.git
cd car-workshop-taksu-bagus
```

2. Install PHP dependencies:

```bash
composer install
```

3. Copy .env.example to .env:

```bash
cp .env.example .env
```

4. Install Node.js dependencies:

```bash
npm install
```

5. Generate application key:

```bash
php artisan key:generate
```

Or you can create the APP_KEY manually by:

1. Open the .env file
2. Find the line containing APP_KEY=
3. Fill it with a random 32-character string, for example:

```
APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

6. Generate JWT Secret:

```bash
php artisan jwt:secret
```

Or you can create the JWT_SECRET manually by:

1. Open the .env file
2. Find the line containing JWT_SECRET=
3. Fill it with a random 32-character string, for example:

```
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

7. Configure the database in the .env file:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=car_workshop_taksu_bagus
DB_USERNAME=<your-username>
DB_PASSWORD=<your-password>
```

8. Create the database manually (if the migrate command fails):

```sql
CREATE DATABASE car_workshop_taksu_bagus;
```

9. Run migrations and seeders:

```bash
php artisan migrate:fresh --seed
```

10. Run the application:

```bash
composer run dev
```

This command will automatically start both the Laravel server and the Vite development server for React.

## Demo Accounts

Here are the accounts that can be used for testing:

### Admin

1. Bagus Suprapta
    - Email: superadmin@carworkshop.com
    - Password: Admin123!
2. Ahmad Rizki
    - Email: manager@carworkshop.com
    - Password: Manager123!

### Mechanics

1. David Wilson
    - Email: d.wilson@carworkshop.com
    - Password: Mechanic123!
2. Robert Garcia
    - Email: r.garcia@carworkshop.com
    - Password: Mechanic123!
3. James Lee
    - Email: j.lee@carworkshop.com
    - Password: Mechanic123!

### Car Owners

1. John Smith
    - Email: john.smith@example.com
    - Password: CarOwner123!
2. Sarah Johnson
    - Email: sarah.j@example.com
    - Password: CarOwner123!
3. Michael Brown
    - Email: m.brown@example.com
    - Password: CarOwner123!

## Features

-   Multi-role authentication (Admin, Mechanic, Car Owner)
-   Car repair management
-   Mechanic task assignment
-   Repair status tracking
-   Service management

## Routes

-   `/diagram/erd` - Display Entity Relationship Diagram (ERD)
-   `/diagram/smd` - Display System Model Diagram (SMD)

## API Documentation

You can access the Postman collection for API documentation and testing at:
[Postman Collection](https://www.postman.com/slickeel/shared-bagussuprapta/collection/8fi4ta8/taksu-car-workshop-bagus?share=true)

> **Note:** The Postman collection does not include all available routes. To see a complete list of all routes in the application, run:
>
> ```bash
> php artisan route:list
> ```
>
> This will show you all routes with their HTTP methods, URIs, and controller actions.

## License

[MIT License](LICENSE.md)
