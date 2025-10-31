// Router
import { Link } from "react-router-dom";

// Icons
import { Verified } from "lucide-react";

const TemplateItem = ({
  type,
  title,
  _id: id,
  banner,
  isVerified,
  description,
}) => {
  const bannerStyles = (() => {
    if (!banner) return {};

    return {
      backgroundColor: "#e31837",
      backgroundImage: `url(${banner.sizes.medium.url})`,
    };
  })();

  return (
    <div
      style={bannerStyles}
      className="group flex flex-col bg-cover justify-between relative overflow-hidden w-full min-h-52 bg-gray-100 rounded-3xl space-y-5 transition-colors duration-200 hover:bg-gray-50"
    >
      {/* Top  */}
      <div className="flex items-center gap-3.5 p-5 pb-0">
        {/* Verified badge */}
        {isVerified && (
          <div
            className={`${
              banner ? "bg-black/20 text-white" : "bg-blue-500/20 text-blue-600"
            } btn gap-1.5 h-10 py-0 px-3 rounded-full backdrop-blur-sm`}
          >
            <Verified
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:rotate-[360deg]"
            />
            <span className="text-sm">Tasdiqlangan</span>
          </div>
        )}

        {/* Type badge   */}
        <div
          className={`${
            banner ? "bg-black/20 text-white" : "bg-green-200 text-green-700"
          } btn gap-1.5 h-6 py-0 px-1.5 rounded-full backdrop-blur-sm`}
        >
          <span className="text-[13.5px] capitalize">{type}</span>
        </div>
      </div>

      {/* Bottom */}
      <div
        className={`${
          banner ? "bg-gradient-to-b from-transparent to-black" : ""
        } w-full p-5 mt-auto transition-[padding-top] duration-200 group-hover:pt-8`}
      >
        {/* Title */}
        <h3
          className={`${
            banner ? "text-white" : ""
          } mb-3 text-xl font-medium capitalize`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`line-clamp-1 ${
            banner ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {description}
        </p>
      </div>

      {/* Link */}
      <Link
        to={`/templates/${id}`}
        className="block absolute z-0 -top-5 inset-0 size-full rounded-3xl"
      />
    </div>
  );
};

export default TemplateItem;
