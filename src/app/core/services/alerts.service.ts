// src/app/Front-End/core/services/alerts.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {


  // Admin related actions
  showCompanyCreatedSuccess(): void {
    Swal.fire({
      title: 'Success',
      text: 'Company created successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer:1500
    });
  }


  showCompanyUpdatedSuccess(): void {
    Swal.fire({
      title: 'Success',
      text: 'Company updated successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer:1500
    });
  }

  async showCompanyConfirmDelete(): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this company?',
      icon: 'warning',
      showCancelButton: true, // Adds a Cancel button
      confirmButtonText: 'Yes, delete  it!',
      cancelButtonText: 'No, keep it',
    });
    return result.isConfirmed;
  }

  showCompanyDeletedSuccess(): void {
    Swal.fire({
      title: 'Success',
      text: 'Company deleted successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer:1500
    });
  }



  // Admin related actions
  showUniversityCreatedSuccess(): void {
    Swal.fire({
      title: 'Success',
      text: 'University created successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer:1500
    });
  }

  showUniversityUpdatedSuccess(): void {
    Swal.fire({
      title: 'Success',
      text: 'University updated successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer:1500
    });
  }

  async showUniversityConfirmDelete(): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this university?',
      icon: 'warning',
      showCancelButton: true, // Adds a Cancel button
      confirmButtonText: 'Yes, delete  it!',
      cancelButtonText: 'No, keep it',
    });
    return result.isConfirmed;
  }

  showUniversityDeletedSuccess(): void {
    Swal.fire({
      title: 'Success',
      text: 'University deleted successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer:1500
    });
  }



}
