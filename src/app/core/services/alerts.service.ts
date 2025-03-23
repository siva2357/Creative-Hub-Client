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


  showJobUpdatedSuccess(): void {
    Swal.fire({
      title: 'Success',
      text: 'Job updated successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer:1500
    });
  }



  async showJobConfirmClose(): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to close this job post?',
      icon: 'warning',
      showCancelButton: true, // Adds a Cancel button
      confirmButtonText: 'Yes, close it!',
      cancelButtonText: 'No, keep it',
    });
    return result.isConfirmed;
  }

  showJobClosedSuccess(): void {
    Swal.fire({
      title: 'Success',
      text: 'Job closed successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer:1500
    });
  }



  async showJobConfirmDelete(): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this job post?',
      icon: 'warning',
      showCancelButton: true, // Adds a Cancel button
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    });
    return result.isConfirmed;
  }


}
