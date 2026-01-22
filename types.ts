
export interface ReceiptData {
  id: string;
  inwardNo: string;
  partyName: string;
  materialName: string;
  customerFault: string;
  materialStatus: 'Serviced' | 'Beyond' | 'Returned' | '';
  reasonFor: 'Beyond' | 'Returned' | '';
  plcHmiVersion: string;
  plcHmiBackupStatus: 'Yes' | 'No' | '';
  engName: string;
  inwardDate: string;
  servicedDate: string;
  noOfDays: string;
  serviceCost: string;
  createdAt: number;
}

export type ReceiptViewMode = 'edit' | 'preview' | 'list';
