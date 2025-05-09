export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  availability: { id: string; start: string; end: string }[];
}

export interface Engineer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  color: string;
  availability: { id: string; start: string; end: string }[];
}

export interface Slot {
  id: string;
  start: string; 
  end: string;   
  status: 'available' | 'booked';
  candidateId: string | null;
  engineerId:  string | null;
  interviewId: string | null;
}

export interface Interview {
  id:         string;
  candidateId:string;
  engineerIds:string[];
  start:      string;
  end:        string;
  duration:   number;
  createdBy:  string;
  createdAt:  string;
}

export interface CalendarSlot {
  id:     string;
  start:  Date;
  end:    Date;
  title?: string;
  engineerId: string;
  engineerName?: string;
  color: string;
  candidateId?: string;
  candidateName?: string;
  status?: 'available' | 'booked';
}

export interface MyEvent {
  id: string
  start: Date
  end: Date
  title: string
  resource: CalendarSlot
}