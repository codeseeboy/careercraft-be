// Fallback job data for when the external API isn't working
export const fallbackJobData = {
  status: "OK",
  request_id: "mock-request-id",
  parameters: {
    query: "developer jobs",
    page: 1,
    num_pages: 1
  },
  data: [
    {
      employer_name: "Acme Corporation",
      employer_logo: "https://example.com/logo.png",
      employer_website: "https://example.com",
      job_id: "mock-job-1",
      job_title: "Senior Backend Developer",
      job_apply_link: "https://example.com/careers",
      job_description: "We are looking for an experienced backend developer to join our team. You will be responsible for building and maintaining our server-side applications.",
      job_is_remote: true,
      job_posted_at_timestamp: Date.now() - 86400000,
      job_posted_at_datetime_utc: new Date(Date.now() - 86400000).toISOString(),
      job_city: "Bangalore",
      job_state: "Karnataka",
      job_country: "IN",
      job_employment_type: "Full Time",
      job_highlights: {
        Qualifications: [
          "5+ years of experience in backend development",
          "Strong knowledge of Node.js and TypeScript",
          "Experience with Express.js and RESTful APIs"
        ],
        Responsibilities: [
          "Design and implement backend services",
          "Optimize application performance",
          "Collaborate with frontend developers"
        ],
        Benefits: [
          "Competitive salary",
          "Flexible work hours",
          "Health insurance"
        ]
      },
      job_required_skills: ["Node.js", "TypeScript", "Express", "MongoDB", "REST API", "Git"]
    },
    {
      employer_name: "Tech Solutions Ltd",
      employer_logo: "https://example.com/techsolutions.png",
      employer_website: "https://techsolutions.example",
      job_id: "mock-job-2",
      job_title: "Full Stack Developer",
      job_apply_link: "https://techsolutions.example/jobs",
      job_description: "We are looking for a Full Stack Developer who is motivated to combine the art of design with the art of programming.",
      job_is_remote: false,
      job_posted_at_timestamp: Date.now() - 172800000,
      job_posted_at_datetime_utc: new Date(Date.now() - 172800000).toISOString(),
      job_city: "Mumbai",
      job_state: "Maharashtra",
      job_country: "IN",
      job_employment_type: "Full Time",
      job_highlights: {
        Qualifications: [
          "3+ years of experience in full stack development",
          "Proficient in React and Node.js",
          "Experience with RESTful APIs and GraphQL"
        ],
        Responsibilities: [
          "Build responsive user interfaces",
          "Develop server-side logic",
          "Ensure cross-platform optimization"
        ],
        Benefits: [
          "Competitive salary",
          "Remote work options",
          "Professional development"
        ]
      },
      job_required_skills: ["React", "Node.js", "JavaScript", "TypeScript", "GraphQL", "MongoDB"]
    }
  ]
};

export const fallbackJobDetails = {
  status: "OK",
  request_id: "mock-details-request",
  data: [
    {
      employer_name: "Acme Corporation",
      employer_logo: "https://example.com/logo.png",
      employer_website: "https://example.com",
      employer_company_type: "Software Development",
      job_id: "mock-job-1",
      job_title: "Senior Backend Developer",
      job_apply_link: "https://example.com/careers",
      job_description: "We are looking for an experienced backend developer to join our team. You will be responsible for building and maintaining our server-side applications. This is a great opportunity to work with cutting-edge technologies in a supportive and innovative environment.\n\nAs a Senior Backend Developer, you will be part of a cross-functional team that's responsible for the full software development life cycle, from conception to deployment. You will work on complex problems where analysis of situations or data requires an in-depth evaluation of variable factors.",
      job_is_remote: true,
      job_posted_at_timestamp: Date.now() - 86400000,
      job_posted_at_datetime_utc: new Date(Date.now() - 86400000).toISOString(),
      job_city: "Bangalore",
      job_state: "Karnataka",
      job_country: "IN",
      job_employment_type: "Full Time",
      job_highlights: {
        Qualifications: [
          "5+ years of experience in backend development",
          "Strong knowledge of Node.js and TypeScript",
          "Experience with Express.js and RESTful APIs",
          "Familiarity with cloud services (AWS, Azure, GCP)",
          "Understanding of CI/CD pipelines",
          "Knowledge of database systems (SQL and NoSQL)"
        ],
        Responsibilities: [
          "Design and implement backend services",
          "Optimize application performance",
          "Collaborate with frontend developers",
          "Write clean, maintainable code",
          "Participate in code reviews",
          "Troubleshoot production issues"
        ],
        Benefits: [
          "Competitive salary",
          "Flexible work hours",
          "Health insurance",
          "401(k) matching",
          "Professional development budget",
          "Casual work environment"
        ]
      },
      job_required_skills: [
        "Node.js", 
        "TypeScript", 
        "Express", 
        "MongoDB", 
        "REST API", 
        "Git",
        "Docker",
        "Kubernetes",
        "CI/CD"
      ],
      job_min_salary: 1800000,
      job_max_salary: 2500000,
      job_salary_currency: "INR",
      job_salary_period: "YEAR"
    }
  ]
};