// Users api
import { usersApi } from "@/api/users.api";

// Toast
import { toast } from "@/notification/toast";

// React
import { useCallback, useEffect } from "react";

// Hooks
import useArrayStore from "@/hooks/useArrayStore";

// Router
import { useSearchParams } from "react-router-dom";

// Components
import Nav from "@/components/Nav";
import PageInfo from "@/components/PageInfo";
import Pagination from "@/components/Pagination";
import ProfilePhoto from "@/components/ProfilePhoto";

// Icons
import { Activity, Clock, ScanHeart, Shield } from "lucide-react";

// Helpers
import { formatDate, formatTime, formatUzPhone } from "@/lib/helpers";

// Get role from query
const getRoleFromParams = (searchParams) => {
  return searchParams.get("role") || "all";
};

// Nav active checker by role
const getActiveRoleNav = (role, navLinks) => {
  return navLinks.findIndex((nav) => {
    const linkRole = nav.link.split("role=")[1];
    return linkRole === role;
  });
};

const Users = () => {
  // Search params
  const [searchParams, setSearchParams] = useSearchParams();
  const currentRole = getRoleFromParams(searchParams);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const {
    setPage,
    initialize,
    getMetadata,
    getPageData,
    hasCollection,
    setPageErrorState,
    setPageLoadingState,
  } = useArrayStore("users-" + currentRole);

  // Initialize collection on mount
  useEffect(() => {
    if (!hasCollection()) initialize(true); // pagination = true
  }, [hasCollection, initialize]);

  const metadata = getMetadata();
  const pageData = getPageData(currentPage);

  const users = pageData?.data || [];
  const hasError = pageData?.error || null;
  const isLoading = pageData?.isLoading || false;
  const hasNextPage = pageData?.hasNextPage ?? false;
  const hasPrevPage = pageData?.hasPrevPage ?? false;

  // Load users for current page
  const loadUsers = useCallback(
    (page, role = "all") => {
      setPageLoadingState(page, true);

      usersApi
        .get({ page, limit: 12, role })
        .then(({ users, code, pagination }) => {
          if (code !== "usersFetched") throw new Error();
          setPage(page, users, null, pagination);
        })
        .catch(({ message }) => {
          toast.error(message || "Nimadir xato ketdi");
          setPageErrorState(page, message || "Nimadir xato ketdi");
        });
    },
    [setPageLoadingState, setPage, setPageErrorState]
  );

  // Navigate to page
  const goToPage = useCallback(
    (page) => {
      if (page < 1) return;
      setSearchParams({ page: page.toString(), role: currentRole });
    },
    [setSearchParams, currentRole]
  );

  // Load users when page changes
  useEffect(() => {
    const pageDataExists = getPageData(currentPage);
    if (!pageDataExists) loadUsers(currentPage, currentRole);
  }, [currentPage, loadUsers, getPageData, currentRole]);

  // Nav role change handler
  const handleNavRoleChange = (link) => {
    const role = link.split("role=")[1] || "all";
    setSearchParams({ page: "1", role });
  };

  // Nav links
  const navLinks = [
    { label: "Barchasi", link: `users?role=all` },
    { label: "Ega", link: `users?role=owner` },
    { label: "Admin", link: `users?role=admin` },
    { label: "Supervisor", link: `users?role=supervisor` },
    { label: "Ustoz", link: `users?role=teacher` },
    { label: "Student", link: `users?role=student` },
  ];

  // Active nav index by role
  const activeNavIndex = getActiveRoleNav(currentRole, navLinks);

  return (
    <div className="container py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1>Foydalanuvchilar</h1>

        {/* Pagination Info */}
        {!isLoading && !hasError && users.length > 0 && metadata && (
          <div className="flex items-center gap-3 text-gray-500">
            <span>
              Hozirgi sahifa:{" "}
              <strong className="font-medium text-black">{currentPage}</strong>{" "}
              / {metadata.totalPages}
            </span>

            <span className="size-1 bg-gray-400 rounded-full" />

            <span>
              Jami foydalanuvchilar:{" "}
              <strong className="font-medium text-black">
                {metadata.total}
              </strong>{" "}
              ta
            </span>
          </div>
        )}
      </div>

      {/* Type navigations */}
      <div className="flex justify-end">
        <Nav
          links={navLinks}
          activeIndex={activeNavIndex}
          onChange={handleNavRoleChange}
        />
      </div>

      {/* Main */}
      <main>
        {/* Skeleton loader */}
        {isLoading && !hasError ? (
          <ul className="grid grid-cols-4 gap-5 animate-pulse">
            {Array.from({ length: 12 }, (_, index) => (
              <UserItemSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {/* Error content */}
        {!isLoading && hasError ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-red-500 text-lg">{hasError}</p>
            <button
              onClick={() => loadUsers(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Qayta urinib ko'rish
            </button>
          </div>
        ) : null}

        {/* No users */}
        {!isLoading && !hasError && users.length === 0 ? (
          <PageInfo
            className="pt-12"
            title="Foydalanuvchilar mavjud emas"
            links={{ primary: { to: -1, body: "Ortga qaytish" } }}
          />
        ) : null}

        {/* Users */}
        {!isLoading && !hasError && users.length > 0 ? (
          <ul className="grid grid-cols-4 gap-5">
            {users.map((user) => (
              <UserItem key={user?._id} {...user} />
            ))}
          </ul>
        ) : null}
      </main>

      {/* Pagination Controls */}
      {!isLoading && !hasError && users.length > 0 && (
        <Pagination
          className="pt-4"
          maxPageButtons={5}
          showPageNumbers={true}
          onPageChange={goToPage}
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalPages={metadata?.totalPages || 1}
        />
      )}
    </div>
  );
};

const UserItem = ({
  role,
  phone,
  avatar,
  _id: id,
  isActive,
  createdAt,
  isVerified,
  lastName = "",
  firstName = "Foydalanuvchi",
}) => {
  return (
    <div className="flex flex-col gap-3.5 justify-between relative w-full min-h-52 bg-gray-100 rounded-3xl p-5">
      {/* Profile */}
      <div className="flex items-center gap-3.5">
        <ProfilePhoto user={{ _id: id, firstName, lastName, avatar }} />

        <div className="max-w-[calc(100%-60px)] h-12">
          <h3 className="text-xl font-medium truncate">
            {`${firstName} ${lastName}`}
          </h3>

          {/* Phone */}
          <a
            href={`tel:+${phone}`}
            className="relative z-10 text-gray-500 text-sm transition-colors duration-200 hover:text-blue-500"
          >
            {formatUzPhone(phone)}
          </a>
        </div>
      </div>

      {/* Mid */}
      <div className="space-y-1.5">
        {/* Role */}
        <div className="flex items-center gap-1.5">
          <Shield strokeWidth={1.5} size={18} />
          <p className="text-[15px] capitalize text-blue-500">{role}</p>
        </div>

        {/* Verified status */}
        <div className="flex items-center gap-1.5">
          <Activity strokeWidth={1.5} size={18} />
          <p
            className={`${
              isVerified ? "text-green-500" : "text-gray-500"
            } text-sm`}
          >
            Tasdiqlan{isVerified ? "" : "ma"}gan
          </p>
        </div>

        {/* Active status */}
        <div className="flex items-center gap-1.5">
          <ScanHeart strokeWidth={1.5} size={18} />
          <p
            className={`${
              isActive ? "text-green-500" : "text-gray-500"
            } text-sm`}
          >
            Aktiv {isActive ? "" : "emas"}
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5">
          <Clock strokeWidth={1.5} size={18} />
          <p className="text-[15px]">
            <span>{formatDate(createdAt)} </span>
            <span className="text-gray-500">{formatTime(createdAt)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const UserItemSkeleton = () => (
  <div className="w-full min-h-52 bg-gray-100 rounded-3xl p-5" />
);

export default Users;
