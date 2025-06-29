import { TenantCategory } from "./tenantCategory";

export interface Tenant {
  id: number;
  tenantCategory: TenantCategory;
  email: string;  
  name: string;
  owner: string;
  phone: string;
  address: string;
  openhour: string;
  closehour: string;
  description?: string;
  imageUrl?: string;
  qrisUrl?: string;
  status: boolean; // aktif/nonaktif
}
