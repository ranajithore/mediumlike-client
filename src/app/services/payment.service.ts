import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubscriptionPlan } from '..';
import urlJoin from 'url-join';
import { environment } from 'src/environments/environment.development';
import { EndPoints } from 'src/end-points';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  public getAllSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    const url = urlJoin(
      environment.serverURL,
      EndPoints.PAYMENT,
      EndPoints.SUBSCRIPTION_PLANS
    );
    return this.http.get<SubscriptionPlan[]>(url);
  }

  public createOrder(subscriptionId: string) {
    const url = urlJoin(
      environment.serverURL,
      EndPoints.PAYMENT,
      EndPoints.CREATE_ORDER
    );
    return this.http.post<any>(url, { subscriptionId });
  }
}
