
export interface BirthdayBoy {
  id: string;
  name: string;
  age: number;
  parentName: string;
  parentPhone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Birthday {
  id: string;
  birthdayBoyId: string;
  date: string;
  startTime: string;
  endTime: string;
  packageType: 'basic' | 'standard' | 'premium';
  guestCount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  deposit: number;
  depositPaid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalBirthdays: number;
  upcomingBirthdays: number;
  completedBirthdays: number;
  cancelledBirthdays: number;
  totalBirthdayBoys: number;
  totalRevenue: number;
}
