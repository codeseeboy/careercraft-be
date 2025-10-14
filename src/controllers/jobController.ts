import { Request, Response } from "express";
import axios from "axios";
import { fallbackJobData, fallbackJobDetails } from "../data/fallbackJobs";

const JSEARCH_API_URL = "https://jsearch.p.rapidapi.com/search";
const JSEARCH_DETAILS_API_URL = "https://jsearch.p.rapidapi.com/job-details";

export const getJobListings = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Job Listing Request:", {
      query: req.query,
      headers: req.headers,
      ip: req.ip
    });
    
    const { 
      query = "developer", 
      location = "India", 
      page = 1, 
      num_pages = 1,
      remote_jobs_only = false,
      employment_types,
      job_requirements,
      company_types,
      page_size = 15 // Add page_size parameter support
    } = req.query;

    // Validate required environment variable
    if (!process.env.RAPIDAPI_KEY) {
      console.error("❌ Missing RAPIDAPI_KEY in environment variables");
      return res.status(500).json({ 
        error: "JSearch API key not configured. Please add RAPIDAPI_KEY to your .env file" 
      });
    }
    
    console.log("✅ RAPIDAPI_KEY found:", process.env.RAPIDAPI_KEY.substring(0, 8) + "...");

    const searchQuery = `${query} jobs in ${location}`;
    
    const params: any = {
      query: searchQuery,
      page: parseInt(page as string),
      num_pages: parseInt(num_pages as string),
      country: "IN",
      date_posted: "all"
    };

    // Add optional parameters if provided
    if (remote_jobs_only === "true") {
      params.remote_jobs_only = true;
    }
    
    if (employment_types) {
      params.employment_types = employment_types;
    }
    
    if (job_requirements) {
      params.job_requirements = job_requirements;
    }
    
    if (company_types) {
      params.company_types = company_types;
    }

    console.log("📤 Sending request to JSearch API:", {
      url: JSEARCH_API_URL,
      params
    });
    
    const response = await axios.get(JSEARCH_API_URL, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      params,
      timeout: 30000, // 30 second timeout
    });
    
    console.log("📥 Received response from JSearch API:", {
      status: response.status,
      data_length: response.data?.data?.length || 0,
    });

    // Transform the response to include more user-friendly data
    const transformedData = {
      ...response.data,
      search_metadata: {
        ...response.data.search_metadata,
        search_query: searchQuery,
        filters_applied: {
          remote_jobs_only: params.remote_jobs_only || false,
          employment_types: params.employment_types || "all",
          job_requirements: params.job_requirements || "all",
          company_types: params.company_types || "all"
        }
      }
    };

    res.json(transformedData);
  } catch (error: any) {
    console.error("❌ Error fetching job listings:", error.message);
    
    // For debugging purposes during development
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : null,
      request: error.request ? "Request was made but no response received" : null
    });
    
    // Use fallback data during development to avoid blocking the UI
    console.log("⚠️ Using fallback job data due to API error");
    
    // For a real production app, you might want to add more specific fallback logic
    // based on error types, but for development, we'll just use the fallback data
    return res.json(fallbackJobData);
  }
};

export const getJobDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Log the received ID for debugging
    console.log(`Fetching job details for ID: ${id}`);
    
    if (!id) {
      return res.status(400).json({ 
        error: "Job ID is required" 
      });
    }

    // Validate required environment variable
    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({ 
        error: "JSearch API key not configured. Please add RAPIDAPI_KEY to your .env file" 
      });
    }

    // Decode the ID if it appears to be encoded (may be double-encoded from frontend)
    const jobId = id.includes('%') ? decodeURIComponent(id) : id;
    
    console.log(`Preparing JSearch API request for job_id: ${jobId}`);
    
    try {
      const response = await axios.get(JSEARCH_DETAILS_API_URL, {
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        params: {
          job_id: jobId,
          extended_publisher_details: false
        },
        timeout: 30000, // 30 second timeout
      });

      // Log response data structure for debugging
      console.log(`JSearch API response received. Status: ${response.status}`);
      console.log(`Data structure: ${JSON.stringify({
        has_data: !!response.data,
        data_length: response.data?.data?.length || 0,
        keys: response.data ? Object.keys(response.data) : []
      })}`);
      
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        return res.status(404).json({
          error: "No Job Found",
          message: "No job details found for the provided ID"
        });
      }

      res.json(response.data);
    } catch (apiError: any) {
      console.error("❌ JSearch API Error Details:", {
        message: apiError.message,
        status: apiError.response?.status,
        responseData: apiError.response?.data,
        requestConfig: {
          url: apiError.config?.url,
          params: apiError.config?.params
        }
      });
      
      if (apiError.response) {
        return res.status(apiError.response.status).json({
          error: "JSearch API Error",
          message: apiError.response.data?.message || apiError.message,
          status: apiError.response.status,
          details: apiError.response.data
        });
      } else {
        throw apiError; // Let the outer catch handle it
      }
    }
  } catch (error: any) {
    console.error("Error fetching job details:", error.message);
    console.error(error.stack);
    
    // Use fallback job details during development to avoid blocking the UI
    console.log("⚠️ Using fallback job details due to API error");
    
    // Return the fallback job details data
    // In production, this would be more sophisticated
    return res.json(fallbackJobDetails);
  }
};

export const searchJobsByFilters = async (req: Request, res: Response) => {
  try {
    const { 
      query = "developer", 
      location = "India",
      page = 1,
      employment_types = "FULLTIME",
      job_requirements = "no_experience",
      remote_jobs_only = false,
      salary_min,
      salary_max,
      company_types = "all"
    } = req.query;

    // Validate required environment variable
    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({ 
        error: "JSearch API key not configured. Please add RAPIDAPI_KEY to your .env file" 
      });
    }

    const searchQuery = `${query} jobs in ${location}`;
    
    const params: any = {
      query: searchQuery,
      page: parseInt(page as string),
      num_pages: 1,
      country: "IN",
      date_posted: "all",
      employment_types,
      job_requirements,
      company_types
    };

    if (remote_jobs_only === "true") {
      params.remote_jobs_only = true;
    }

    if (salary_min) {
      params.salary_min = parseInt(salary_min as string);
    }

    if (salary_max) {
      params.salary_max = parseInt(salary_max as string);
    }

    const response = await axios.get(JSEARCH_API_URL, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      params,
      timeout: 30000,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Error searching jobs with filters:", error.message);
    
    // Use fallback data for advanced search as well
    console.log("⚠️ Using fallback job data for advanced search due to API error");
    
    // For now, we'll use the same fallback data for all searches
    // In production, you'd want to filter this based on the search parameters
    return res.json(fallbackJobData);
  }
};