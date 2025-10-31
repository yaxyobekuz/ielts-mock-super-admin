// Toast
import { toast } from "@/notification/toast";

// Images
import ieltsLogo from "@/assets/icons/logo.svg";

// Backgrounds
import ieltsBg from "@/assets/backgrounds/ielts.png";

// Hooks
import usePathSegments from "@/hooks/usePathSegments";

// Router
import { Link, Navigate, Outlet } from "react-router-dom";

// React
import { useEffect, useLayoutEffect, useRef } from "react";

const AuthLayout = () => {
  const auth = localStorage.getItem("auth");
  if (auth) return <AuthenticatedContent />;
  else return <UnauthenticatedContent />;
};

const UnauthenticatedContent = () => {
  const contentRef = useRef(null);
  const { pathSegments } = usePathSegments();

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.classList.add("animate__fadeIn");

      setTimeout(() => {
        content.classList.remove("animate__fadeIn");
      }, 300);
    }
  }, [pathSegments[1]]);

  return (
    <div className="grid grid-cols-2 size-full h-screen bg-white animate__animated animate__fadeIn">
      <div className="flex flex-col items-center justify-between gap-8 w-full p-8 max-h-full overflow-y-auto">
        {/* Logo */}
        <img
          height={40}
          width={122.5}
          src={ieltsLogo}
          alt="IELTS logo svg"
          className="w-[122.5px] h-9"
        />

        {/* Main */}
        <div className="text-center">
          {/* Title */}
          <h1 className="mb-3 text-2xl font-semibold">Hisobga kirish</h1>

          {/* Description */}
          <p className="mb-3 text-gray-500 not-italic animate__animated animate__fadeIn">
            Hisobingizga kirish uchun <br /> Iltimos ma'lumotlaringizni kiriting
          </p>

          {/* Content */}
          <div ref={contentRef} className="w-[360px] animate__animated">
            <Outlet />
          </div>
        </div>

        {/* Bottom */}
        <p className="max-w-lg text-center text-gray-500">
          © IELTS 2025 - Barcha huquqlar himoyalangan.
        </p>
      </div>

      {/* Images */}
      <img
        width={960}
        height={945}
        src={ieltsBg}
        alt="IELTS with whiteblue background"
        className="w-full h-screen bg-[#daeef9] object-cover"
      />
    </div>
  );
};

const AuthenticatedContent = () => {
  useLayoutEffect(() => toast("Siz allaqachon hisobingizga kirgansiz"), []);
  return <Navigate to="/" />;
};

export default AuthLayout;
