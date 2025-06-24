export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean | null;
}

export interface UserInterface {
  data: UserData;
  date: string;
  status: number;
}
