import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SubscriptionPlan } from 'src/app';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PaymentService } from 'src/app/services/payment.service';
import { EndPoints } from 'src/end-points';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss'],
})
export class SubscriptionDetailsComponent implements AfterViewInit {
  public subscriptionForm = this.formBuilder.group({
    selectedPlan: [{ value: '' }, [Validators.required]],
  });
  public subscriptionPlans = new BehaviorSubject<SubscriptionPlan[]>([]);
  public hasActiveSubscription = new BehaviorSubject(false);

  public currentLoggedInUser = this.storage.getCurrentLoggedInUser();

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private storage: LocalStorageService,
    private router: Router
  ) {
    this.paymentService.getAllSubscriptionPlans().subscribe((data) => {
      if (this.currentLoggedInUser.activeSubscriptionPlanId) {
        this.subscriptionPlans.next(
          data.filter(
            (plan) =>
              plan._id === this.currentLoggedInUser.activeSubscriptionPlanId
          )
        );
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.currentLoggedInUser.hasActiveSubscription) {
      this.hasActiveSubscription.next(true);
      this.subscriptionForm
        .get('selectedPlan')
        ?.setValue(this.currentLoggedInUser.activeSubscriptionPlanId);
    }
  }

  public onClickBuyAPlanBtn() {
    this.router.navigateByUrl(EndPoints.PAYMENT);
  }
}
