"use client";

import { useState, useEffect } from "react";
import type { Company } from "@/types/organizational-structure";
import { CompaniesAPI } from "@/lib/companies-api";
import { CompaniesTable } from "@/components/companies/companies-table";
import { RouteGuard } from "@/components/auth/route-guard";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import type { SortingState } from "@tanstack/react-table";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    loadCompanies();
  }, [pagination, searchTerm, sorting]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const offset = pagination.pageIndex * pagination.pageSize;
      const sort = sorting[0];
      const orderBy = sort ? sort.id : "id";
      const orderType = sort ? (sort.desc ? "DESC" : "ASC") : "DESC";

      const response = await CompaniesAPI.getCompanies({
        orderBy,
        orderType,
        offset,
        pageSize: pagination.pageSize,
        name: searchTerm,
      });
      setCompanies(response.data.results);
      setPageCount(Math.ceil(response.data.total / pagination.pageSize));
    } catch (error) {
      console.error("Error loading companies:", error);
      toast.error("Error al cargar las empresas");
    } finally {
      setLoading(false);
    }
  };

  if (loading && companies.length === 0) {
    return (
      <RouteGuard requiredPermission="read:roles">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p>Cargando empresas...</p>
            </div>
          </div>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requiredPermission="read:roles">
      <CompaniesTable
        data={companies}
        pageCount={pageCount}
        pagination={pagination}
        setPaginationAction={setPagination}
        sorting={sorting}
        setSortingAction={setSorting}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTermAction={setSearchTerm}
      />
    </RouteGuard>
  );
}
