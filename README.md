# Weebit
#### An anime-themed reddit clone made using Typeorm, express, Nextjs, TailwindCSS and SWR

### TechStack:
  **Server**: TypeORM, express

  **Client**: NextJS, Tailwind CSS and SWR
  
  **Database**: PostgreSQL

### To Run the server and client locally:
1. Run ```npm i``` command to install dependancies
2. Setup database settings inside 'data-source.ts' (use a .env file to configure, dotEnvTemplate given as reference)
3. Run ```npm run typeorm -- migration:generate src/migration/<migration_name>```
4. Run ```npm run typeorm -- migration:run```
5. Run ```npm run dev``` command to run both server and also client (***cli can be found in [package.json](package.json)***)
6. open http://localhost:3000

### Features:
* Authentication using JWT token
* Password hashed using Bcrypt
* Checks of for valid email, username and password(using class-validator)
* Optimised data fetching using SWR
* Infinite loading in home page using SWR
* Commenting functionality

### Register Page:
![register page](screenshots/register.png)

### Login Page:
![Login page](screenshots/login.png)

### Home Page:
![Home page](screenshots/homepage.png)

### Create subWeebit Page:
![Create subWeebit Page](screenshots/create_subweebit.png)

### Create Post page:
![Create Post page](screenshots/create_post_page.png)

### Post Page:
![Post Page](screenshots/post_page_comments.png)

### SubWeebit Page:
![SubWeebit Page](screenshots/subweebit_page.png)

### User Page:
![User Page](screenshots/userpage.png)

## Acknowledgements:
* [Classed](https://www.youtube.com/@Classsed) for YouTube tutorial on how to make the website
* [Adobe Stock Image](/client/public/images/background.jpg)


***The [icon](/client/public/icons/icon_big.png) used is made by me***