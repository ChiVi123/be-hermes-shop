import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ default: false })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
