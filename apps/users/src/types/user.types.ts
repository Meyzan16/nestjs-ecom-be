import { ObjectType, Field } from "@nestjs/graphql";
import  { User } from '../entities/user.entity';

//error response
@ObjectType()
export class ErrorType {
    @Field()
    message: string;

    @Field({nullable:true})
    code?: string;
}

//register response
@ObjectType()
export class RegisterResponse {
    @Field()
    activation_token: string;

    @Field(() => ErrorType, {nullable:true})
    error?: ErrorType;
}

//activation response
@ObjectType()
export class ActivationResponse {
    @Field(() => User)
    user: User|any;

    @Field(() => ErrorType, {nullable:true})
    error?: ErrorType;
}

//login response
@ObjectType()
export class LoginResponse {
    @Field(() => User)
    user: User;

    @Field(() => ErrorType, {nullable:true})
    error?: ErrorType;
}


