export type SubmissionStatus = "Pending" | "Reviewed" | "Shortlisted" | "Signed";

export type Submission = {
  id: string;
  artist_name: string;
  email: string;
  track_title: string;
  genre: string;
  track_link: string;
  message: string;
  status: SubmissionStatus;
  upload_url?: string;
  created_at: string;
  plays: number;
};

export type Artist = {
  name: string;
  genre: string;
  image: string;
  highlight: string;
};
