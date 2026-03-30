export interface User {
  usrId?: number;
  usrName: string;
  usrPassword: string;
  usrRole?: string;
  usrStatus?: number;
  usrCreatedBy?: string;
  usrCreatedDate?: Date;
  usrModifBy?: string;
  usrModifDate?: Date;
}
