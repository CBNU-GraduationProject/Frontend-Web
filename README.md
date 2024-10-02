관리자페이지 프론트
===================

This project is a Vue.js frontend and Spring Boot backend application designed to manage hazardous materials. It allows users to view, register, update, and delete hazard data, including photos, GPS coordinates, and status.

## Features

### Frontend
- Built with Vue.js, Axios, and CoreUI.
- View a paginated table of hazard data.
- Search and filter hazard records.
- Register and edit hazard information, including photos and GPS coordinates.

## Prerequisites
- **Frontend**: Node.js, Vue.js
- **Backend**: Java 17, Spring Boot, MySQL (or H2)

## Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies and run the Vue.js app:
    ```bash
    npm install
    npm run serve
    ```

## API Endpoints
- **GET** `/api/hazarddata` - Fetch all hazards.
- **POST** `/api/hazarddata/add` - Add a new hazard (including photo upload).
- **PUT** `/api/hazarddata/update/{id}` - Update hazard by ID.
- **DELETE** `/api/hazarddata/delete/{id}` - Delete hazard by ID.
- **GET** `/api/hazarddata/photo/{id}` - Retrieve hazard photo by ID.

## Technologies
- **Frontend**: Vue.js, Axios, CoreUI
- **Backend**: Spring Boot, Hibernate, JPA
- **Database**: MySQL or H2 (default)

## Project Structure

## Frontend
- `App.vue`: Main app layout.
- `components/`: UI components for viewing and editing hazard data.

## Usage
- Use the Vue.js frontend to manage hazardous materials.
- Admins can register, edit, and delete hazardous data entries.
- Visualize records with photos and update statuses in real time.

