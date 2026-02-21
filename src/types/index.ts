export interface KhatmaGroup {
  id: string;
  name: string;
  created_at: string;
}

export interface Khatma {
  id: string;
  group_id: string;
  name: string;
  start_date: string;
  created_at: string;
}

export interface KhatmaWithProgress {
  id: string;
  group_name: string;
  name: string;
  start_date: string;
  created_at: string;
  total_taken: number;
  percentage: number;
}

export type JuzStatus = 'EN_COURS' | 'TERMINE';

export interface JuzAssignment {
  id: string;
  khatma_id: string;
  juz_number: number;
  participant_name: string;
  status: JuzStatus;
  created_at: string;
}
