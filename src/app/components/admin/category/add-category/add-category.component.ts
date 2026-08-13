import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../../../../models/category.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  private fb = inject(FormBuilder);
errorMessage: string | null = null;
  private categoryService = inject(CategoryService);

 

  categoryForm: FormGroup;

  constructor(
    private dialogRef:MatDialogRef<AddCategoryComponent>,
       @Inject(MAT_DIALOG_DATA) public data: any,
       private cdr: ChangeDetectorRef
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (!this.data.add) {
      this.categoryForm.patchValue({
        name: this.data.category.name,
      });
    }
  }

  async onSubmit() {
    if (this.categoryForm.invalid) return;

    const categoryData: Category = {
      ...this.data.category,
      ...this.categoryForm.value
    } as Category;

      try {
        const request = this.data.add
          ? this.categoryService.addCategory(categoryData)
          : this.categoryService.updateCategory(categoryData.id, categoryData);
    
        const res = await firstValueFrom(request);
        if (!res) {
         this.errorMessage = res?.message || 'Something went wrong';
         this.cdr.detectChanges();
            return;
        }
    
        this.dialogRef.close({ status: true });
    
      } catch (err) {
       this.errorMessage = 'Something went wrong';
       this.cdr.detectChanges();
            return;
      }
    }
    
    
      onCancel() {
       this.dialogRef.close({status:false})
      }
}
