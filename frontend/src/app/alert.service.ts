import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  showErrorAlert(text: string, action: string, duration: number) {
    this.snackBar.open(text, action, {
      duration: duration,
      panelClass: 'error-snackbar',
    });
  }

  showSuccessAlert(text: string, action: string, duration: number) {
    this.snackBar.open(text, action, {
      duration: duration,
    });
  }
}
