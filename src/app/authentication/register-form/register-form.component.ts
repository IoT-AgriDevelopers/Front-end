import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css'],
})
export class RegisterFormComponent {
  submitted = false;
  hide = true;
  usersList: User[] = [];
  newUser!: User;

  registerForm = this.formBuilder.group({
    username: ['', { validators: [Validators.required], updateOn: 'change' }],
    email: [
      '',
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'change',
      },
    ],
    password: [
      '',
      {
        validators: [Validators.required, Validators.minLength(8)],
        updateOn: 'change',
      },
    ],
    terms: [
      false,
      { validators: [Validators.requiredTrue], updateOn: 'change' },
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe((response: any) => {
      this.usersList = response;
    });
  }

  submitForm() {
    //cuando se haga submit ir al dashboard
    this.submitted = true;

    let user = {
      username: this.registerForm.get('username')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      premium: false,
      plants: null,
      events: null,
      plots: null,
    };
    if (
      this.usersList.find((u: User) => {
        return u.email == user.email;
      })
    ) {
      alert('Email already exist!');
      return;
    }
    this.userService.create(user).subscribe();
    this.router.navigate(['/accounts/plans']);
  }

  getUsernameError() {
    return 'Please, enter an username';
  }

  getEmailError() {
    if (this.registerForm?.get('email')?.hasError('email')) {
      return 'Please, enter a valid email address';
    }
    return 'Please, enter an email address';
  }

  getPasswordError() {
    if (this.registerForm?.get('password')?.hasError('minlength')) {
      return 'Please, enter a password at least 8 characters';
    }
    return 'Please, enter a password';
  }
}
