export interface Company {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  industry: string | null;
  createdAt?: string;
  areas: {
    id: number;
    name: string;
    departments: {
      id: number;
      name: string;
      positions: {
        id: number;
        name: string;
      }[];
    }[];
  }[];
}

export interface CompanyCreateRequest {
  name: string;
  address: string;
  email: string;
  phone: string;
  industry: string;
}

export interface CompanyUpdateRequest {
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  industry?: string;
}

export interface CompaniesResponse {
  status: string;
  data: {
    total: number;
    pageSize: number;
    offset: number;
    results: Company[];
  };
}

export interface CompanyResponse {
  status: string;
  data: Company;
}

// Area types
export interface Area {
  id: number;
  name: string;
  description: string;
  company: {
    id: number;
    name: string;
  };
  createdAt?: string;
}

export interface AreaCreateRequest {
  name: string;
  description: string;
  companyId: number;
}

export interface AreaUpdateRequest {
  name?: string;
  companyId?: number;
}

export interface AreasResponse {
  status: string;
  data: {
    total: number;
    pageSize: number;
    offset: number;
    results: Area[];
  };
}

export interface AreaResponse {
  status: string;
  data: Area;
}

// Department types
export interface Department {
  id: number;
  name: string;
  description: string;
  area: {
    id: number;
    name: string;
  };
  createdAt?: string;
}

export interface DepartmentCreateRequest {
  name: string;
  description: string;
  areaId: number;
}

export interface DepartmentUpdateRequest {
  name?: string;
  areaId?: number;
}

export interface DepartmentsResponse {
  status: string;
  data: {
    total: number;
    pageSize: number;
    offset: number;
    results: Department[];
  };
}

export interface DepartmentResponse {
  status: string;
  data: Department;
}

// Position types
export interface Position {
  id: number;
  name: string;
  description: string;
  department: {
    id: number;
    name: string;
  };
  createdAt?: string;
}

export interface PositionCreateRequest {
  name: string;
  description: string;
  departmentId: number;
}

export interface PositionUpdateRequest {
  name?: string;
  departmentId?: number;
}

export interface PositionsResponse {
  status: string;
  data: {
    total: number;
    pageSize: number;
    offset: number;
    results: Position[];
  };
}

export interface PositionResponse {
  status: string;
  data: Position;
}
