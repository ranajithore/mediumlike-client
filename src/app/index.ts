export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  role?: string;
  email?: string;
  isEmailVerified?: string;
  hasActiveSubscription?: boolean;
  activeSubscriptionPlanId?: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Blog {
  _id: string;
  author: User;
  featureImage: string;
  title: string;
  subTitle: string;
  body: string;
  category: Category;
  isPaid: boolean;
  isPublished: boolean;
  createdAt: Date;
  lastModifiedAt?: Date;
  publishedAt?: Date;
  views: any[];
  approxReadTime: number;
  approxReadTimeText: number;
  likes: any[];
  hasLiked: boolean;
  hasBookmarked: boolean;
}

export interface CreateBlog {
  featureImage?: string;
  title: string;
  subTitle: string;
  body: string;
  category: string;
  isPaid: boolean;
}

export interface BlogsResponse {
  totalCount: number;
  blogs: Blog[];
}

export interface CreateComment {
  blogId: string;
  body: string;
  mentionedUser?: string;
}

export interface Comment {
  _id: string;
  blogId: string;
  author: User;
  body: string;
  likes: any[];
  createdAt: Date;
  hasLiked: boolean;
}

export interface SubscriptionPlan {
  _id: string;
  type: string;
  title: string;
  description: string;
  amount: number;
  durationInDays: number;
}

export enum UserRoles {
  admin = 'admin',
  nonPremiumUser = 'nonPremiumUser',
  premiumUser = 'premiumUser',
}
