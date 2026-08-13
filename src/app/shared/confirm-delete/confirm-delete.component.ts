import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {
 
 constructor(
   private dialogRef:MatDialogRef<ConfirmDeleteComponent>,
   @Inject(MAT_DIALOG_DATA) public data: any,
 ) {
    
 } 
  onCancel() {
this.dialogRef.close({status:false})  }

  onConfirm() {
this.dialogRef.close({status:true})  }
  }

