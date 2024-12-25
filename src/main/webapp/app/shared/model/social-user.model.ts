export interface ISocialUser {
  id?: any;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  socialType?: 'GOOGLE' | 'FACEBOOK' | 'LOCAL';
  socialId?: string;
}

export class SocialUser implements ISocialUser {
  constructor(
    public id?: any,
    public email?: string,
    public firstName?: string,
    public lastName?: string,
    public imageUrl?: string,
    public socialType?: 'GOOGLE' | 'FACEBOOK' | 'LOCAL',
    public socialId?: string,
  ) {}
}
