import { SafeHtml } from "@angular/platform-browser";

export interface ProjectUpload {
  _id?: string;
  projectDetails: {
    file: { fileName: string; url: string };  // Changed from Array to Object
    projectTitle: string;
    projectType: string;
    softwares: string;
    tags: string;
    projectDescription: string;
    sanitizedProjectDescription?: SafeHtml;
   };

  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProjectResponse {
  totalProjects: number;
  projects: ProjectUpload[];
}
