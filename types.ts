
export interface ReceiptData {
  id: string;
  inwardNo: string;
  partyName: string;
  materialName: string;
  serialNo: string;
  customerFault: string;
  materialStatus: 'Serviced' | 'Beyond' | 'Returned' | 'Waiting for Spare' | '';
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
