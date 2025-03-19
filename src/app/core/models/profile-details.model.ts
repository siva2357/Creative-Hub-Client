import { SafeHtml } from "@angular/platform-browser";

export interface RecruiterProfile {
  _id?: string;
  profileDetails: {
    profilePicture: { fileName: string; url: string;};
      firstName: string;
      lastName: string;
      userName: string;
      email?: string;
      gender: string;
      dateOfBirth: string;
      phoneNumber: string;
      streetAddress: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
      companyName: string;
      designation: string;
      experience: string;
      employeeCode: string;
      bioDescription: string;
      sanitizedBioDescription?: SafeHtml;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}



export interface SeekerProfile {
  _id?: string;
  profileDetails: {
    profilePicture: { fileName: string;url: string;};
      firstName: string;
      lastName: string;
      userName:string;
      email?: string;
      gender: string;
      dateOfBirth: string;  // ✅ Fix: Keep as string since API returns a string
      phoneNumber: string;
      streetAddress: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
      universityName: string;
      universityDegree: string;
      yearOfGraduation: Date;
      universityNumber: string; // ✅ Fix: Properly defined within profileDetails
      bioDescription: string;
      sanitizedBioDescription?: SafeHtml;
    };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}






export interface SocialMedia {
    seekerId:string;
    _id?: string;
      socialMediaDetails: {
        socialMediaProfile: string;
        socialMediaLink: string;
      };
  }

  export interface TechnicalSkills {
    seekerId:string;
      _id?: string;
        skillDetails: {
          skillSet: string;
          proficiency: string;
      };
  }


  export interface Languages {
    seekerId:string;
      _id?: string;
        languageDetails: {
          language: string;
          proficiency: string;
      };
  }


  export interface Subjects {
    seekerId:string;
      _id?: string;
        subjectDetails: {
          subject: string;
          semester:string;
          percentage: string;
      };
  }

  export interface Certifications {
    seekerId:string;
    _id?: string;
        certificationDetails: {
          courseName: string;
          associatedAuthority:string;
          certificationURL: string;
          certificationDate: string;
          ceritificationDescription:string;
          certificateUpload:{ fileName: string; url: string };
      };
  }


  export interface Resume {
    seekerId:string;
      _id?: string;
        resumeDetails: {
          resumeTitle:String;
          resumeUpload: { fileName: string; url: string };  // Changed from Array to Object
          createdAt:Date;
      };
  }
