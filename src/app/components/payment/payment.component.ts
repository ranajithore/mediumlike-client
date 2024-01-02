import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SubscriptionPlan } from 'src/app';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PaymentService } from 'src/app/services/payment.service';
import { EndPoints } from 'src/end-points';

import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  public paymentForm = this.formBuilder.group({
    selectedPlan: ['', [Validators.required]],
  });
  public subscriptionPlans = new BehaviorSubject<SubscriptionPlan[]>([]);
  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private storage: LocalStorageService,
    private authService: AuthService,
    private router: Router,
    private alertService: CustomAlertService
  ) {
    this.paymentService.getAllSubscriptionPlans().subscribe((data) => {
      this.subscriptionPlans.next(data);
      this.paymentForm.get('selectedPlan')?.setValue(data[0]._id);
    });
  }

  public onClickPayBtn(ev: Event) {
    const currentLoggedInUser = this.storage.getCurrentLoggedInUser();
    ev.preventDefault();
    ev.stopPropagation();
    const formData = this.paymentForm.getRawValue();
    this.paymentService
      .createOrder(formData.selectedPlan!)
      .subscribe((order) => {
        var options = {
          key: environment.razorPayKeyId, // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: 'INR',
          name: 'Medium Like',
          // image: 'https://example.com/your_logo',
          order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          prefill: {
            name:
              currentLoggedInUser.firstName +
              ' ' +
              (currentLoggedInUser.lastName !== 'null'
                ? currentLoggedInUser.lastName
                : ''),
            email: currentLoggedInUser.email,
          },
          theme: {
            color: '#000',
          },
        };
        const razorPay = new (window as any).Razorpay(options);
        razorPay.on('payment.captured', async () => {
          const result = await this.alertService.showSuccessModal(
            'Payment Successful',
            'You will be signed out after this. Please log in again.'
          );
          if (result.isConfirmed || result.isDismissed) {
            this.authService.logOut();
            this.router.navigateByUrl(EndPoints.SIGN_IN);
          }
        });
        razorPay.open();
      });
  }
}
