// import {
//   Component,
//   EventEmitter,
//   Input,
//   OnChanges,
//   OnInit,
//   Output,
//   SimpleChanges,
// } from '@angular/core';

// @Component({
//   selector: 'app-table-inline-edit',
//   templateUrl: './table-inline-edit.component.html',
//   styleUrls: ['./table-inline-edit.component.scss'],
// })
// export class TableInlineEditComponent implements OnInit, OnChanges {
//   @Input() medicines: any[] = [];
//   @Input() isDirectManipulation: boolean = true; // Mặc định là thao tác trực tiếp

//   @Output() updatePrescription = new EventEmitter<any>();
//   @Output() deletePrescription = new EventEmitter<number>();

//   // Mảng sao lưu dữ liệu ban đầu
//   originalMedicinesData: any[] = [];

//   ngOnInit(): void {}

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes.users && changes.users.currentValue) {
//       this.originalMedicinesData = this.medicines.map((prescription) => ({
//         ...prescription,
//       }));
//     }
//     console.log(this.medicines, this.originalMedicinesData);
//   }

//   enableEdit(medicines: any): void {
//     // Khôi phục dữ liệu gốc nếu user đang bị chỉnh sửa
//     this.medicines.forEach((u) => {
//       if (u.isEditing && u !== medicines) {
//         const originalUser = this.originalMedicinesData.find(
//           (original) => original.id === u.id
//         );
//         Object.assign(u, originalUser);
//         u.isEditing = false;
//       }
//     });

//     medicines.isEditing = true;
//   }

//   saveEdit(medicine: any): void {
//     medicine.isEditing = false;
//     this.updatePrescription.emit(medicine);
//   }

//   cancelEdit(medicine: any): void {
//     // Tìm người dùng trong mảng dữ liệu ban đầu và khôi phục lại dữ liệu
//     const originalPrescription = this.originalMedicinesData.find(
//       (original) => original.id === medicine.id
//     );
//     if (originalPrescription) {
//       // Gán lại từng thuộc tính của user với dữ liệu gốc
//       medicine.name = originalPrescription.name;
//       medicine.quantity = originalPrescription.quantity;
//       medicine.unit = originalPrescription.unit;
//       medicine.dosage = originalPrescription.dosage;
//     }
//     medicine.isEditing = false;
//     console.log(this.originalMedicinesData, originalPrescription);
//   }

//   deleteUserAction(id: number): void {
//     this.deletePrescription.emit(id);
//   }
// }

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-table-inline-edit',
  templateUrl: './table-inline-edit.component.html',
  styleUrls: ['./table-inline-edit.component.scss'],
})
export class TableInlineEditComponent implements OnInit, OnChanges {
  @Input() medicines: any[] = [];
  @Input() isSoftManipulation: boolean = false; // Input mới

  @Output() updatePrescription = new EventEmitter<any>();
  @Output() deletePrescription = new EventEmitter<number>();

  originalMedicinesData: any[] = [];
  tempMedicinesData: any[] = []; // Mảng dữ liệu tạm

  ngOnInit(): void {
    this.tempMedicinesData = [...this.medicines];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.medicines && changes.medicines.currentValue) {
      this.originalMedicinesData = this.medicines.map((prescription) => ({
        ...prescription,
      }));
      this.tempMedicinesData = this.originalMedicinesData.filter(
        (medicine) => !medicine.isDeleted
      ); // Lọc ra những dữ liệu không bị đánh dấu xóa
    }
  }

  enableEdit(medicines: any): void {
    // Khôi phục dữ liệu gốc nếu user đang bị chỉnh sửa
    this.medicines.forEach((u) => {
      if (u.isEditing && u !== medicines) {
        const originalUser = this.originalMedicinesData.find(
          (original) => original.id === u.id
        );
        Object.assign(u, originalUser);
        u.isEditing = false;
      }
    });

    medicines.isEditing = true;
  }

  saveEdit(medicine: any): void {
    if (this.isSoftManipulation) {
      // Cập nhật mảng tạm thay vì gọi API
      console.log('a' + this.tempMedicinesData);
      const index = this.tempMedicinesData.findIndex(
        (m) => m.id === medicine.id
      );
      if (index !== -1) {
        // Ensure the isEditing property is set to false before updating the array
        const updatedMedicine = { ...medicine, isEditing: false };
        this.tempMedicinesData[index] = updatedMedicine;
      }
      console.log('b' + this.tempMedicinesData);
    } else {
      // Gọi API cập nhật
      // Ensure the isEditing property is set to false before emitting the update
      const updatedMedicine = { ...medicine, isEditing: false };
      this.updatePrescription.emit(updatedMedicine);
    }
    // No need to set medicine.isEditing = false here since it's done in both branches above
  }

  cancelEdit(medicine: any): void {
    // Tìm người dùng trong mảng dữ liệu ban đầu và khôi phục lại dữ liệu
    const originalPrescription = this.originalMedicinesData.find(
      (original) => original.id === medicine.id
    );
    if (originalPrescription) {
      // Gán lại từng thuộc tính của user với dữ liệu gốc
      medicine.name = originalPrescription.name;
      medicine.quantity = originalPrescription.quantity;
      medicine.unit = originalPrescription.unit;
      medicine.dosage = originalPrescription.dosage;
    }
    medicine.isEditing = false;
    console.log(this.originalMedicinesData, originalPrescription);
  }

  deleteUserAction(id: number): void {
    if (this.isSoftManipulation) {
      // Đánh dấu xóa trong mảng tạm thay vì gọi API
      const index = this.tempMedicinesData.findIndex((m) => m.id === id);
      if (index !== -1) {
        this.tempMedicinesData[index].isDeleted = true;
      }
      this.tempMedicinesData = this.tempMedicinesData.filter(
        (medicine) => !medicine.isDeleted
      ); // Cập nhật lại mảng tạm để không hiển thị dữ liệu đã xóa
    } else {
      // Gọi API xóa
      console.log(id);

      this.deletePrescription.emit(id);
    }
  }
}
