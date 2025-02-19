import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AiOutlineMenu, AiOutlineHome, AiOutlineCar } from "react-icons/ai";

export function CategoryMenu() {
  return (
    <div className="relative group hidden md:block">
      <Button
        variant="ghost"
        className="text-base hover:bg-transparent hover:text-primary transition-colors"
      >
        <AiOutlineMenu className="h-5 w-5 mr-2" />
        Categories
      </Button>

      <div className="absolute left-0 top-full w-[200px] bg-white border rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="py-2">
          <Link
            to="#"
            className="block px-4 py-3 hover:text-primary cursor-not-allowed opacity-60"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <AiOutlineHome className="h-5 w-5 inline-block mr-2" />
            <span className="text-base">租房 (即将上线)</span>
          </Link>

          <Link
            to="#"
            className="block px-4 py-3 hover:text-primary cursor-not-allowed opacity-60"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <AiOutlineCar className="h-5 w-5 inline-block mr-2" />
            <span className="text-base">租车 (即将上线)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
