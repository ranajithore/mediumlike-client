import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { EndPoints } from 'src/end-points';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements AfterViewInit {
  public isPasswordResetEmail = new BehaviorSubject(false);
  public redirectInSeconds = 15;
  public redirectTimeout = 1000 * this.redirectInSeconds;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.isPasswordResetEmail.next(state['isPasswordResetEmail'] || false);
    }
  }

  public ngAfterViewInit(): void {
    const interval = setInterval(() => {
      this.redirectInSeconds--;
    }, 1000);

    setTimeout(() => {
      this.router.navigateByUrl(EndPoints.DASHBOARD);
      clearInterval(interval);
    }, this.redirectTimeout);
  }
}
