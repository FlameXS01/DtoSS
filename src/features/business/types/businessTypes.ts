export interface Business {
    id: number;
    business_name: string;
    legal_name: string | null;
    description: string | null;
    slogan: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    address_line1: string | null; 
    address_line2: string | null;
    logo_url: string | null;
    banner_url: string | null;
    currency: string | 'CUP';
    second_currency: string | null;
    tax_rate: number | null;
    status: string | 'pending';
    is_verified: boolean | false;
    verification_data: JSON | null;
    created_at: string;
    updated_at: string | null;
}

export interface BusinessFilters {
  status?: string;
  is_verified?: boolean;
  // otros posibles
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface BusinessResponse{
  items: Business;
  total: number;
}