import { TweeterRequest } from "./TweeterRequest";

export interface RegisterRequest extends TweeterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly userAlias: string;
  readonly password: string;
  readonly imageString: string;
  readonly imageFileExtension: string;
}
