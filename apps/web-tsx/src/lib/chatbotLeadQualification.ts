export type ChatbotLeadIntent =
  | "start_quote"
  | "product_help"
  | "quote_review"
  | "floorplan_help"
  | "contact_human"
  | "scope_question"
  | "unknown";

export type ChatbotLeadQualification = {
  source_page: string;
  source_url: string;
  intent: ChatbotLeadIntent;
  suburb?: string;
  property_type?: "house" | "townhouse" | "apartment" | "commercial" | "not_sure";
  product_category?: "hybrid" | "laminate" | "engineered_timber" | "not_sure";
  area_status: "known" | "unknown" | "has_floorplan" | "not_sure";
  approx_area_m2?: number;
  stairs_status: "yes" | "no" | "not_sure";
  removal_status: "yes" | "no" | "not_sure";
  floorplan_status: "has_floorplan" | "no_floorplan" | "not_sure";
  existing_quote_status: "has_quote" | "no_quote" | "not_sure";
  urgency?: "asap" | "1_4_weeks" | "1_3_months" | "just_researching" | "not_sure";
  next_action:
    | "go_to_quote"
    | "go_to_products"
    | "go_to_quote_review"
    | "go_to_floorplan"
    | "request_contact"
    | "continue_chat";
  handoff_url?: string;
  missing_info: string[];
  confidence: "low" | "medium" | "high";
};
