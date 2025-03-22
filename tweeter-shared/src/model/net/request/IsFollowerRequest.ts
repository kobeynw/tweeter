import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerRequest extends TweeterRequest {
  readonly token: string;
  readonly user: UserDto | null;
  readonly selectedUser: UserDto | null;
}
