import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Creative-Hub-Client';


  uploading: boolean = false; // Track upload state
  isSubmitting = false;
  isLoading = false;
  ifPreview = false;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
  previewURL: SafeResourceUrl | null = null;
  fileRef: any;
  fileType: string | null = null;
  uploadComplete = false;
  errorMessage!: string;


  constructor(
    private storage: AngularFireStorage,
    private domSanitizer: DomSanitizer
  ) {}

  uploadFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const filePath = `Creative-Hub/${file.name}`;

      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      this.previewURL = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));

      this.fileType = this.getFileType(file);

      this.ifPreview = true;

      task.snapshotChanges().subscribe({
        next: (snapshot) => {
          if (snapshot?.state === 'success') {
            fileRef.getDownloadURL().subscribe((url) => {
              console.log('File uploaded successfully. URL:', url);

              this.uploadedFileData = {
                fileName: file.name,
                url: url,
                filePath: filePath
              };
              this.uploadComplete = true;
            });
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.errorMessage = 'File upload failed. Please try again.';
        }
      });

    }

  }


  deletePreview(): void {
    this.previewURL = null;
    this.fileType = null;
    this.uploadComplete =false;

    if (this.uploadedFileData) {
      const { filePath } = this.uploadedFileData;

      this.storage.ref(filePath).delete().subscribe({
        next: () => {
          console.log('File deleted from Firebase Storage');
          this.uploadedFileData = null;
          this.ifPreview = false;
        },
        error: (error) => {
          console.error('Error deleting file from Firebase Storage:', error);
          this.errorMessage = 'Failed to delete the file. Please try again.';
        }
      });
    }
  }


  getFileType(file: File): string {
    const mimeType = file.type;

    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (mimeType.startsWith('audio/')) {
      return 'audio';
    } else {
      return 'unknown';
    }
  }


}
