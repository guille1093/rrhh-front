"use client";

import { useState, useEffect } from "react";
import type { Area } from "@/types/organizational-structure";
import { AreasAPI } from "@/lib/areas-api";
import { AreasTable } from "@/components/areas/areas-table";
import { RouteGuard } from "@/components/auth/route-guard";
import { toast } from "sonner";
import type { SortingState } from "@tanstack/react-table";

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    loadAreas();
  }, [pagination, searchTerm, sorting]);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const offset = pagination.pageIndex * pagination.pageSize;
      const sort = sorting[0];
      const orderBy = sort ? sort.id : "id";
      const orderType = sort ? (sort.desc ? "DESC" : "ASC") : "DESC";

      const response = await AreasAPI.getAreas({
        orderBy,
        orderType,
        offset,
        pageSize: pagination.pageSize,
        name: searchTerm,
      });
      setAreas(response.data.results);
      setPageCount(Math.ceil(response.data.total / pagination.pageSize));
    } catch (error) {
      console.error("Error loading areas:", error);
      toast.error("Error al cargar las áreas");
    } finally {
      setLoading(false);
    }
  };

  if (loading && areas.length === 0) {
    return (
      <RouteGuard requiredPermission="read:roles">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p>Cargando áreas...</p>
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
          <h1 className="text-3xl font-bold">Áreas</h1>
          <p className="text-muted-foreground">
            Gestiona las áreas de las empresas
          </p>
        </div>
      </div>
      <AreasTable
        data={areas}
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
