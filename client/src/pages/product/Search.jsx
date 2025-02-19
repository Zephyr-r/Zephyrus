import { useLocation } from "react-router-dom";
import { ProductCard } from "@/components/shared/ProductCard";
import { useEffect, useState } from "react";
import { searchProducts } from "@/api/products";

const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchProducts(searchQuery);
        setProducts(response.data || []);
      } catch (error) {
        setError(error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchResults();
    } else {
      setLoading(false);
      setProducts([]);
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">搜索中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-neutral-500">请输入搜索关键词</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* 搜索结果头部 */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-2">
          搜索结果: {searchQuery}
        </h1>
        <p className="text-sm md:text-base text-neutral-500">
          找到 {products.length} 个相关商品
        </p>
      </div>

      {/* 搜索结果列表 */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              images={product.images}
              seller={product.seller}
              condition={product.condition}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-neutral-500 mb-2">没有找到相关商品</p>
          <p className="text-sm text-neutral-400">
            试试其他关键词，或者浏览其他商品
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
