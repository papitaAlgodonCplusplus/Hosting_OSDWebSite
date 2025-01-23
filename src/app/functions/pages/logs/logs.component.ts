import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { OSDService } from 'src/app/services/osd-event.services';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logsForm: FormGroup;
  databaseChangeLogsVisible: boolean = true;
  userActionLogsVisible: boolean = true;
  expandedRow: number | null = null;
  selectedUserId: string = ''; // Stores the selected user ID
  users: any[] = []; // Array to hold user data

  originalDatabaseLogs: any[] = []; // Store original database logs
  originalUserLogs: any[] = []; // Store original user action logs

  constructor(private fb: FormBuilder, private osdService: OSDService, private cdr: ChangeDetectorRef) {
    this.logsForm = this.fb.group({
      databaseLogs: this.fb.array([]),
      userLogs: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.fetchUsers(); // Fetch list of users for the dropdown
    this.fetchDatabaseLogs();
    this.fetchUserActionLogs();
  }

  get databaseLogs(): FormArray {
    return this.logsForm.get('databaseLogs') as FormArray;
  }

  get userLogs(): FormArray {
    return this.logsForm.get('userLogs') as FormArray;
  }

  logSelectedUser(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    const selectedUser = this.users.find(user => String(user.id) === selectedValue);
    this.selectedUserId = selectedUser?.id || '';
  }

  fetchUsers(): void {
    this.osdService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.Body?.users || [];
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Error fetching users:', error);
      }
    });
  }

  fetchDatabaseLogs(): void {
    this.osdService.getDatabaseChangeLogs().subscribe({
      next: (response: any) => {
        const logs = response.Body?.logs || [];
        this.originalDatabaseLogs = logs; // Store original data
        this.updateDatabaseLogsForm(logs); // Update the form for display
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Error fetching database logs:', error);
      }
    });
  }

  fetchUserActionLogs(): void {
    this.osdService.getUserActionLogs().subscribe({
      next: (response: any) => {
        const logs = response.Body?.logs || [];
        this.originalUserLogs = logs; // Store original data
        this.updateUserLogsForm(logs); // Update the form for display
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Error fetching user action logs:', error);
      }
    });
  }

  updateDatabaseLogsForm(logs: any[]): void {
    this.databaseLogs.clear();
    logs.forEach((log) => {
      const logGroup = this.fb.group({
        id: [log.id],
        table_name: [log.table_name],
        operation_type: [log.operation_type],
        change_time: [log.change_time],
        row_data: [log.row_data]
      });
      this.databaseLogs.push(logGroup);
    });
  }

  updateUserLogsForm(logs: any[]): void {
    this.userLogs.clear();
    logs.forEach((log) => {
      const logGroup = this.fb.group({
        id: [log.id],
        user_id: [log.user_id],
        action: [log.action],
        page_url: [log.page_url],
        element_clicked: [log.element_clicked],
        additional_info: [log.additional_info],
        timestamp: [log.timestamp]
      });
      this.userLogs.push(logGroup);
    });
  }

  applyUserFilter(): void {
    if (this.selectedUserId) {
      const filteredDatabaseLogs = this.originalDatabaseLogs.filter(
        (log) => log.user_id === this.selectedUserId
      );
      const filteredUserLogs = this.originalUserLogs.filter(
        (log) => log.user_id === this.selectedUserId
      );
      this.updateDatabaseLogsForm(filteredDatabaseLogs);
      this.updateUserLogsForm(filteredUserLogs);
    } else {
      this.updateDatabaseLogsForm(this.originalDatabaseLogs);
      this.updateUserLogsForm(this.originalUserLogs);
    }
  }

  toggleSection(section: string): void {
    if (section === 'databaseChangeLogs') {
      this.databaseChangeLogsVisible = !this.databaseChangeLogsVisible;
    } else if (section === 'userActionLogs') {
      this.userActionLogsVisible = !this.userActionLogsVisible;
    }
  }

  toggleRowData(rowIndex: number): void {
    this.expandedRow = this.expandedRow === rowIndex ? null : rowIndex;
  }

  getRowDataKeys(rowData: any, operationType: string): string[] {
    if (rowData && typeof rowData === 'object') {
      if (operationType === 'INSERT') {
        // Return the keys directly if it's an INSERT operation
        return Object.keys(rowData || {});
      } else if (operationType === 'DELETE') {
        // Return keys from the old object
        return Object.keys(rowData.old || {});
      } else if (operationType === 'UPDATE') {
        // Combine keys from both old and new objects
        const oldKeys = Object.keys(rowData.old || {});
        const newKeys = Object.keys(rowData.new || {});
        return Array.from(new Set([...oldKeys, ...newKeys]));
      }
    }
    return [];
  }

  onUserChange(): void {
  }
}
