import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubCategory } from './add-sub-category';

describe('AddSubCategory', () => {
  let component: AddSubCategory;
  let fixture: ComponentFixture<AddSubCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
