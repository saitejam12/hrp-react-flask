export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type JobStatus = 'draft' | 'open' | 'closed' | 'on_hold';
export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';
export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical';
export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string;
  salaryRange: string;
  postedDate: string;
  closingDate: string;
  createdBy: string;
  applicantCount: number;
}

export interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  appliedDate: string;
  resumeUrl?: string;
  notes?: string;
}

export interface Interview {
  id: string;
  applicantId: string;
  applicantName: string;
  jobTitle: string;
  type: InterviewType;
  scheduledDate: string;
  duration: number;
  interviewers: string[];
  location: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
}

export interface Offer {
  id: string;
  applicantId: string;
  applicantName: string;
  jobTitle: string;
  salary: number;
  currency: string;
  startDate: string;
  expiryDate: string;
  status: OfferStatus;
  notes?: string;
  createdAt: string;
}
