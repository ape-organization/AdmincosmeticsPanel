import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-sub-category',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],

  templateUrl: './add-sub-category.html',
  styleUrl: './add-sub-category.scss'
})
export class AddSubCategory {

  private readonly fb = inject(FormBuilder);

  private readonly dialogRef =
    inject(MatDialogRef<AddSubCategory>);

  readonly form = this.fb.group({

    categoryId: [
      null as number | null,
      Validators.required
    ],

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],

    description: [
      '',
      Validators.maxLength(500)
    ]

  });


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    const subcategory = this.data?.subcategory;

    if (subcategory) {

      this.form.patchValue({

        categoryId:
          subcategory.categoryId ?? null,

        name:
          subcategory.name ?? '',

        description:
          subcategory.description ?? ''

      });

    }

  }


  // =========================================================
  // SAVE
  // =========================================================

  save(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    const value = this.form.getRawValue();


    const payload = {

      categoryId: value.categoryId!,

      name: value.name!.trim(),

      description:
        value.description?.trim() || null

    };


    /*
      Do NOT call the API here.

      The parent component will receive this object
      and call:

      POST  /api/SubCategory

      or

      PUT   /api/SubCategory/{id}
    */

    this.dialogRef.close({

      status: true,

      data: payload

    });

  }


  // =========================================================
  // CANCEL
  // =========================================================

  cancel(): void {

    this.dialogRef.close({

      status: false

    });

  }

}