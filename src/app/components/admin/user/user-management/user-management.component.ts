import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { SharedModule } from '../../../../shared/shared.module';
import { AddUserComponent } from '../add-user/add-user.component';
import { firstValueFrom, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../../../shared/confirm-delete/confirm-delete.component';
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  displayedColumns: string[] = [ 'username', 'email', 'actions'];
  errMsg="";
  showError=false;
  showDeleteConfirm = false;
  userToEdit: User | null = null;
  userIdToDelete: number | null = null;
  dataSource = new MatTableDataSource<User>();

  constructor( private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}


ngOnInit(): void {
  this.loadUsers();
}

loadUsers(): void {
 this.userService.getUsers().subscribe(users => {
    this.dataSource.data = users;
  });
}

showAddUser()
{
          this.userToEdit = null;

this.dialog.open(AddUserComponent,{
  data:
  {user:this.userToEdit || null,
  add:true}
}).afterClosed().subscribe((res:any)=>
  {
  if (!res || !res.status) 
return;
    this.loadUsers();
    this.closeAddUser();
  })
}



  editUser(user: User) {
        this.userToEdit = user;

    this.dialog.open(AddUserComponent,{
  data:
  {user:this.userToEdit || null,
  add:false}
}).afterClosed().subscribe((res:any)=>
  {
    if (!res || !res.status) return;
    this.loadUsers();
    this.closeAddUser();
  })
  }

  deleteUser(user: any) {
    this.dialog.open(ConfirmDeleteComponent,
      {
data:  'Are you sure you want to delete this item?'
      }
      ).afterClosed().subscribe((res:any)=>
      {
        if(!res || !res.status) return;
         this.userService.deleteUser(user).subscribe(() => {
              this.userIdToDelete = null;

        this.loadUsers();
      });
      })
  }



  closeAddUser() {
    this.userToEdit = null;
  }
}
