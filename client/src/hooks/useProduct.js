import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { searchProducts, getProducts } from "@/api/products";

export function useProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await searchProducts({ query: searchQuery });
      return response.data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "搜索失败",
        description: error.message,
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (page = 1, limit = 12) => {
    try {
      setLoading(true);
      const response = await getProducts({ page, limit });
      if (response && response.products) {
        return {
          products: response.products,
          hasMore: response.currentPage < response.totalPages,
          total: response.total,
        };
      }
      throw new Error("Invalid response format");
    } catch (err) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "获取商品失败",
        description: err.message,
      });
      return {
        products: [],
        hasMore: false,
        total: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    handleSearch,
    fetchProducts,
  };
}
