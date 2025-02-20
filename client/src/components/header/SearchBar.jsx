import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AiOutlineSearch } from "react-icons/ai";
import { useProduct } from "@/hooks/useProduct";
import PropTypes from "prop-types";

export function SearchBar({ isMobile = false }) {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { searchQuery, setSearchQuery, handleSearch } = useProduct();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    await handleSearch();
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div
      ref={searchRef}
      className={
        isMobile ? "md:hidden" : "hidden md:block flex-1 max-w-2xl mx-8"
      }
    >
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex relative">
          <Input
            type="search"
            placeholder="Search for products..."
            className="pr-12 rounded-full h-10 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="absolute right-1 top-1 rounded-full h-8 w-8 p-0"
          >
            <AiOutlineSearch className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  isMobile: PropTypes.bool,
};
