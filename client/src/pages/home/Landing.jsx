import { ProductCard } from "@/components/shared/ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "@/api/products";

const Landing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ page, limit: 12 });
        if (response && response.products) {
          setProducts((prev) =>
            page === 1 ? response.products : [...prev, ...response.products]
          );
          setHasMore(response.currentPage < response.totalPages);
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  if (loading && products.length === 0) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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

      {loading && (
        <div className="flex justify-center py-4">
          <div className="text-lg">Loading...</div>
        </div>
      )}

      {!loading && hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Landing;
