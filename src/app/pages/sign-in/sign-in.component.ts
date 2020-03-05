import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AuthenticationService } from 'src/app/services/AuthenticationService';
import { AlertService } from 'src/app/services/AlertService';
import { first } from 'rxjs/operators';
import { IRegisterModel } from 'src/app/models/registerModel';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  returnUrl: string;

  constructor(public formBuilder: FormBuilder, public router:Router, public snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private alertService: AlertService) { 
      // redirect to home if already logged in already
      if (this.authService.currentUserValue) {
        this.router.navigate(['/']);
    }
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    }, {validator: matchingPasswords('password', 'confirmPassword')});

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public onLoginFormSubmit(values:Object):void {
    if (this.loginForm.valid) {
      this.authService.login(values['email'], values['password'])
      .pipe(first())
      .subscribe(
        data => {
          if (data.statusCode === 200) {
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          this.alertService.error(error.message);
        }
      )
    }
  }

  public onRegisterFormSubmit(values:FormGroup):void {
    let registerModel:IRegisterModel={
      name:values['name'],
      confirmPassword:values['confirmPassword'],
      email:values['email'],
      password:values['password']
    };
    if (this.registerForm.valid) {
      this.authService
      // this.alertService.success('You have been registered successfully!');
    }
  }

}
