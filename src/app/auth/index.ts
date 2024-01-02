import { User } from '..';

export interface SignInRequest {
  email: string | null;
  password: string | null;
}

export interface SignInResponse {
  userInfo: User;
  accessToken: string;
  refreshToken: string;
  isEmailVerificationRequired: boolean;
}

export interface SignUpRequest {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
}

export interface RefreshAccessTokenResponse {
  accessToken: string;
}
