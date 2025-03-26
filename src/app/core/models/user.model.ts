import { SeekerProfile } from "./profile-details.model";
import { ProjectUpload } from "./project-upload.model";

export interface Recruiter {
  _id?: string;
  registrationDetails: {
      email: string;
      password?: string; // Optional since it's usually not returned from backend
      verified?: boolean;
      verificationCode?: string;
      verificationCodeValidation?: number;
      forgotPasswordCode?: string;
      forgotPasswordCodeValidation?: number;
  };
  role: string;
  lastLoginAt?: Date | null;
  lastLogoutAt?: Date | null;
  status?: string; // Match backend enum
  createdAt?: Date; // Mongoose timestamps field
  updatedAt?: Date; // Mongoose timestamps field
}

  export interface RecruiterResponse {
    totalRecruiters: number;
    recruiters: Recruiter[];
  }


export interface Seeker {
  _id?: string;
  registrationDetails: {
      email: string;
      password?: string; // Optional since it's usually not returned from backend
      verified?: boolean;
      verificationCode?: string;
      verificationCodeValidation?: number;
      forgotPasswordCode?: string;
      forgotPasswordCodeValidation?: number;
  };
  role: string;
  lastLoginAt?: Date | null;
  lastLogoutAt?: Date | null;
  status?: "active" | "inactive"; // Match backend enum
  createdAt?: Date; // Mongoose timestamps field
  updatedAt?: Date; // Mongoose timestamps field
}



export interface SeekerData {
  _id?: string;
  profile: SeekerProfile,
  seekerProjectUpload:ProjectUpload
  role: string;
  lastLoginAt?: Date | null;
  lastLogoutAt?: Date | null;
  status?: "active" | "inactive"; // Match backend enum
  createdAt?: Date; // Mongoose timestamps field
  updatedAt?: Date; // Mongoose timestamps field
}

export interface SeekerResponse {
  totalSeekers: number;
  seekers: Seeker[];
}


export interface Admin {
  _id?: string;
  registrationDetails: {
      firstName: string;
      lastName: string;
      userName: string;
      email: string;
      password: string;
      profilePicture:string;
      verified?: boolean;
  };
  role: string;
}
