"use client";

import { useState, useEffect } from "react";
import type { Position } from "@/types/organizational-structure";
import { PositionsAPI } from "@/lib/positions-api";
import { PositionsTable } from "@/components/positions/positions-table";
import { RouteGuard } from "@/components/auth/route-guard";
import { toast } from "sonner";
import type { SortingState } from "@tanstack/react-table";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [pageCount, setPageCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    loadPositions();
  }, [pagination, searchTerm, sorting]);

  const loadPositions = async () => {
    try {
      setLoading(true);
      const offset = pagination.pageIndex * pagination.pageSize;
      const sort = sorting[0];
      const orderBy = sort ? sort.id : "id";
      const orderType = sort ? (sort.desc ? "DESC" : "ASC") : "DESC";

      const response = await PositionsAPI.getPositions({
        orderBy,
        orderType,
        offset,
        pageSize: pagination.pageSize,
        name: searchTerm,
      });
      setPositions(response.data.results);
      setPageCount(Math.ceil(response.data.total / pagination.pageSize));
    } catch (error) {
      console.error("Error loading positions:", error);
      toast.error("Error al cargar los puestos");
    } finally {
      setLoading(false);
    }
  };

  if (loading && positions.length === 0) {
    return (
      <RouteGuard requiredPermission="read:roles">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p>Cargando puestos...</p>
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
          <h1 className="text-3xl font-bold">Puestos</h1>
          <p className="text-muted-foreground">
            Gestiona los puestos de las empresas
          </p>
        </div>
      </div>
      <PositionsTable
        data={positions}
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
