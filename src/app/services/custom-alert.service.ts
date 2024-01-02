import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CustomAlertService {
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  public showSuccess(text: string): Promise<SweetAlertResult> {
    return this.toast.fire({
      icon: 'success',
      title: text,
    });
  }

  public showError(text: string): Promise<SweetAlertResult> {
    return this.toast.fire({
      icon: 'error',
      title: text,
    });
  }

  public showSuccessModal(
    title: string,
    text: string
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#212529',
    });
  }

  public showWarningModal(
    title: string,
    text: string
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#212529',
    });
  }

  public showFailureModal(
    title: string,
    text: string
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#212529',
    });
  }
}
