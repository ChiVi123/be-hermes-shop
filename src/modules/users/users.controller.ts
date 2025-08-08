import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { Public } from '~/decorators/public';
import { CreateUserDto } from '~/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '~/modules/users/dto/update-user.dto';
import { UsersService } from '~/modules/users/users.service';
import { Query as QueryParams } from '~/types/apiQueryParams';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: string | QueryParams) {
    return this.usersService.findAll(query);
  }

  @Get('me')
  findOne(@Request() req: { user: { username: string } }) {
    return this.usersService.findByEmail(req.user.username, true);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
