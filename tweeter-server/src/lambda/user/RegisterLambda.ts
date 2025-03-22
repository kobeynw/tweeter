import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<RegisterResponse> => {
  const userService = new UserService();
  const [userDto, tokenDto] = await userService.register(
    request.firstName,
    request.lastName,
    request.userAlias,
    request.password,
    request.imageString,
    request.imageFileExtension
  );

  return {
    success: true,
    message: null,
    user: userDto,
    authToken: tokenDto,
  };
};
