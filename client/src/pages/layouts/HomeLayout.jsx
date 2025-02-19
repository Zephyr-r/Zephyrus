import { Outlet } from "react-router-dom";
import { Header } from "@/components/header";

const HomeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-4 md:py-8 mt-[4rem]">
        <Outlet />
      </main>
      <footer className="w-full bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 Zephyrus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
