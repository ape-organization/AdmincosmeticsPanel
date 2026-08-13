import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../../../../models/category.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatIconModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

 
errorMessage: string | null = null;

  productForm: FormGroup;
  selectedFile: File | null = null;
  private readonly PLACEHOLDER_IMAGE = 'https://placehold.co/200x200?text=Upload+Image';
  imagePreview: string | ArrayBuffer | null = this.PLACEHOLDER_IMAGE;
  
categories:any=[]
  constructor(
    private dialogRef:MatDialogRef<AddProductComponent>,
   @Inject(MAT_DIALOG_DATA) public data: any,
   private cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      stockQuantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
this.categories=this.data.categories   
    if (!this.data.add) {
      this.productForm.patchValue(this.data.product);
      this.imagePreview = this.data.product.imageUrl || this.PLACEHOLDER_IMAGE;
    }
  }



onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  this.selectedFile = input.files[0];

  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
    this.cdr.detectChanges()
  };

  reader.readAsDataURL(this.selectedFile);
}

  private buildFormData(): FormData {
  const formData = new FormData();

  Object.keys(this.productForm.controls).forEach(key => {
    const value = this.productForm.get(key)?.value;
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  return formData;
}
private handleResponse(res: any): void {
  if (!res) {
    this.setError(res?.message || 'Something went wrong');
    return;
  }

  this.dialogRef.close({ status: true });
}
private setError(message: string): void {
  this.errorMessage = message;
  this.cdr.detectChanges();
}
  async onSubmit(): Promise<void> {
  if (this.productForm.invalid) return;

  this.errorMessage = '';

  try {
    const formData = this.buildFormData();
    const productName = this.productForm.get('name')?.value?.trim();

    // 🔹 ADD MODE
    if (this.data.add) {

      const exists = await firstValueFrom(
        this.productService.checkProductExists(productName)
      );

      if (exists) {
        this.setError('Product already exists');
        return;
      }

      const res = await firstValueFrom(
        this.productService.addProduct(formData)
      );
      this.handleResponse(res);
      return;
    }

    // 🔹 UPDATE MODE
    const res = await firstValueFrom(
      this.productService.updateProduct(this.data.product.id, formData)
    );

    this.handleResponse(res);

  } catch (error) {
    this.setError('Something went wrong');
  }
}
  
  
    onCancel() {
     this.dialogRef.close({status:false})
    }
}
