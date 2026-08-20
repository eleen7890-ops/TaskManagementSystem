import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  users: User[] = [];
  editingUserId: number | null = null;
  get isDarkMode(): boolean {
  return this.themeService.isDarkMode;
}
  error = '';
  showForm = false;
  userToDelete: User | null = null;
  selectedUser: User | null = null;
  readonly pageSize = 6;
  currentPage = 1;
  private readonly formBuilder = inject(FormBuilder);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  userForm = this.formBuilder.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private readonly userService: UserService ,readonly themeService: ThemeService ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.error = '';
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.currentPage = Math.min(this.currentPage, this.totalPages);
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.error = 'Unable to load users. Make sure the API is running.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.users.length / this.pageSize));
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  viewUser(user: User): void {
    this.selectedUser = user;
  }

  closeUserDetails(): void {
    this.selectedUser = null;
  }

  openAdd(): void {
    this.editingUserId = null;
    this.error = '';
    this.userForm.reset({ fullName: '', email: '' });
    this.showForm = true;
  }

  openEdit(user: User): void {
    this.editingUserId = user.userId;
    this.error = '';
    this.userForm.patchValue({ fullName: user.fullName, email: user.email });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.userForm.reset({ fullName: '', email: '' });
  }

  save(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.error = 'Enter a valid name and email.';
      return;
    }

    const value = this.userForm.getRawValue();
    const user = { fullName: value.fullName ?? '', email: value.email ?? '' };
    const handleSuccess = (): void => { this.closeForm(); this.loadUsers(); };
    const handleError = (error: any): void => {
      this.error = error.error?.message || 'The user could not be saved.';
    };

    if (this.editingUserId === null) {
      this.userService.createUser(user).subscribe({ next: handleSuccess, error: handleError });
    } else {
      this.userService.updateUser(this.editingUserId, user).subscribe({ next: handleSuccess, error: handleError });
    }
  }

  delete(user: User): void {
    this.userToDelete = user;
    this.error = '';
  }

  cancelDelete(): void {
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;
    const userId = this.userToDelete.userId;
    this.userService.deleteUser(userId).subscribe({
      next: () => { this.userToDelete = null; this.loadUsers(); },
      error: error => this.error = error.error?.message || 'This user cannot be deleted because they have assigned tasks.'
    });
  }


 toggleTheme(): void {
  this.themeService.toggle();
}
}