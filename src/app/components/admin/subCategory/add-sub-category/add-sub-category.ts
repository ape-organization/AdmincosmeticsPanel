import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-sub-category',
  imports: [ CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule],
  templateUrl: './add-sub-category.html',
  styleUrl: './add-sub-category.scss',
})
export class AddSubCategory {
 private readonly fb = inject(FormBuilder);
  readonly form = this.fb.group({
    categoryId: [
      null as number | null,
      Validators.required
    ],

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    description: ['']
  });
  constructor(
    private dialogRef:MatDialogRef<AddSubCategory>,
       @Inject(MAT_DIALOG_DATA) public data: any,
       private cdr: ChangeDetectorRef
  ) {
 // Set values after MAT_DIALOG_DATA is available
    this.form.patchValue({

      categoryId:
        this.data?.subcategory?.categoryId ?? null,

      name:
        this.data?.subcategory?.name ?? '',

      description:
        this.data?.subcategory?.description ?? ''

    });

  }






  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.dialogRef.close(
      this.form.getRawValue()
    );

  }


  cancel(): void {

    this.dialogRef.close();

  }

}
