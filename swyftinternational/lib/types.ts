export type Candidate = {
  id: string;
  slug: string;
  realName: string;
  phone: string;
  email: string;
  interviewNotes: string;
  country: string;
  city: string;
  roleTitle: string;
  pseudonym: string;
  headline: string;
  summary: string;
  background: string;
  experience: string;
  personality: string;
  lookingFor: string;
  highlights: string[];
  skills: string[];
  monthlyPayCents: number | null;
  startDate: string | null;
  yearsExperience: number | null;
  availability: string;
  willingToOverlap: string;
  introVideoKey: string | null;
  isSample: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type JobPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType: string;
  hiringOrganization: string;
  country: string;
  locationLabel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryUnit: string | null;
  isSample: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MeetingRequest = {
  id: string;
  candidateId: string;
  shortlistId: string | null;
  type: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  preferredTimes: string;
  status: string;
  createdAt: string;
  candidateName: string;
};

export type Employer = {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type TalentSearch = {
  id: string;
  employerId: string;
  roleTitle: string;
  firstYearSalaryCents: number;
  notes: string;
  feePercent: number;
  depositCents: number;
  guaranteeDays: number;
  status: string;
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
  company: string;
  contactName: string;
  email: string;
};

export type Shortlist = {
  id: string;
  employerId: string | null;
  title: string;
  preparedFor: string;
  token: string;
  intro: string;
  isPublished: boolean;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StaffUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: "admin" | "library";
};
