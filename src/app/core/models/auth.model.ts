
export interface Login {
  email: string;          // Email address
  password: string;       // Password for the account
}

// Define the expected response structure after login
// Define the expected response structure after login
export interface LoginResponse {
  userId:string;
  role: string;       // The role of the user (recruiter, seeker, admin, etc.)
  token?: string;     // Optional field if the backend returns a token (e.g., JWT)
  verified:boolean;
  success:boolean;
  profileComplete:boolean;
}
