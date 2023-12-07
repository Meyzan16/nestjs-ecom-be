import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from '../../../prisma/Prisma.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import jwt from '@nestjs/jwt';

interface userData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtservice: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  //register user service
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;

    //pengecekan jika email ada
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new BadRequestException('User already exist with this email');
    }

    //pnegecekan no hp
    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });
    if (isPhoneNumberExist) {
      throw new BadRequestException(
        'User already exist with this phone number',
      );
    }

    const hashedPassword = await await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-email',
      name,
      activationCode,
    });

    // console.log(activation_token);

    return { activation_token };
  }

  //create activation token
  async createActivationToken(user: userData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtservice.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '2m',
      },
    );
    return { token, activationCode };
  }


  //activation code
  async activateUser(activateDto: ActivationDto, response:Response) {
    const { activationCode, activationToken } = activateDto;

    const newUser: { user: userData; activationCode: number } =
      this.jwtservice.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: userData; activationCode: number };

    if (newUser.activationCode != activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const {name,email,password,phone_number} = newUser.user;
    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      }
    });
    
    if(existUser) {
      throw new BadRequestException('user already exist with this email!');
    }

    const user = await this.prisma.user.create({
      data:{
        name,
        email,
        password,
        phone_number
      }
    })

    return { user, response };

  }

  //login service
  async Login(loginDto: LoginDto) {
    const { email, passsword } = loginDto;
    const user = {
      email,
      passsword,
    };
    return user;
  }

  //get all user service
  async getUsers() {
    return this.prisma.user.findMany({});
  }
}
