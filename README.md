<!-- installer -->
1. nest new //create nest
2. nest g app // generate folder
3. nest g module --name // generate module
4. nest g service --name // generate service

<!-- package -->
1. npm i @apollo/gateway  @apollo/subgraph @nestjs/apollo @nestjs/graphql graphql class-validator bcrypt @types/bcrypt @nestjs/config @nestjs/jwt
2. npm i express, 
3. npm i @nestjs-modules/mailer nodemailer ejs @types/ejs

<!-- prisma -->
3. npm i -d prisma 
4. npm i @prisma/client
5. npx prisma init
6. npx prisma db push // setelah create schema maka push dan create database
6. npx prisma studio // generate url



<!-- 
mutation{
  register(registerDto: {
    name:"meyzan",
    email:"Meyzan1605@gmail.com",
    password:"12345678",
    phone_number:"123456"
  }){
    activation_token
  }
}

mutation{
  activateUser(
    activationDto:{
      activationToken:"",
      activationCode: 2404
    }
  ){
    user{
      name
      email
      password
      role
    }
  }
}
 -->