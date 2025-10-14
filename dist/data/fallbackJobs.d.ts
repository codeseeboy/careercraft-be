export declare const fallbackJobData: {
    status: string;
    request_id: string;
    parameters: {
        query: string;
        page: number;
        num_pages: number;
    };
    data: {
        employer_name: string;
        employer_logo: string;
        employer_website: string;
        job_id: string;
        job_title: string;
        job_apply_link: string;
        job_description: string;
        job_is_remote: boolean;
        job_posted_at_timestamp: number;
        job_posted_at_datetime_utc: string;
        job_city: string;
        job_state: string;
        job_country: string;
        job_employment_type: string;
        job_highlights: {
            Qualifications: string[];
            Responsibilities: string[];
            Benefits: string[];
        };
        job_required_skills: string[];
    }[];
};
export declare const fallbackJobDetails: {
    status: string;
    request_id: string;
    data: {
        employer_name: string;
        employer_logo: string;
        employer_website: string;
        employer_company_type: string;
        job_id: string;
        job_title: string;
        job_apply_link: string;
        job_description: string;
        job_is_remote: boolean;
        job_posted_at_timestamp: number;
        job_posted_at_datetime_utc: string;
        job_city: string;
        job_state: string;
        job_country: string;
        job_employment_type: string;
        job_highlights: {
            Qualifications: string[];
            Responsibilities: string[];
            Benefits: string[];
        };
        job_required_skills: string[];
        job_min_salary: number;
        job_max_salary: number;
        job_salary_currency: string;
        job_salary_period: string;
    }[];
};
