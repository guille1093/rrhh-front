"use client";

import { useState, useEffect } from "react";
import type { Department } from "@/types/organizational-structure";
import { DepartmentsAPI } from "@/lib/departments-api";
import { DepartmentsTable } from "@/components/departments/departments-table";
import { RouteGuard } from "@/components/auth/route-guard";
import { toast } from "sonner";
import type { SortingState } from "@tanstack/react-table";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    loadDepartments();
  }, [pagination, searchTerm, sorting]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const offset = pagination.pageIndex * pagination.pageSize;
      const sort = sorting[0];
      const orderBy = sort ? sort.id : "id";
      const orderType = sort ? (sort.desc ? "DESC" : "ASC") : "DESC";

      const response = await DepartmentsAPI.getDepartments({
        orderBy,
        orderType,
        offset,
        pageSize: pagination.pageSize,
        name: searchTerm,
      });
      setDepartments(response.data.results);
      setPageCount(Math.ceil(response.data.total / pagination.pageSize));
    } catch (error) {
      console.error("Error loading departments:", error);
      toast.error("Error al cargar los departamentos");
    } finally {
      setLoading(false);
    }
  };

  if (loading && departments.length === 0) {
    return (
      <RouteGuard requiredPermission="read:roles">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p>Cargando departamentos...</p>
            </div>
          </div>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requiredPermission="read:roles">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departamentos</h1>
          <p className="text-muted-foreground">
            Gestiona los departamentos de las empresas
          </p>
        </div>
      </div>
      <DepartmentsTable
        data={departments}
        pageCount={pageCount}
        pagination={pagination}
        setPaginationAction={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </RouteGuard>
  );
}
