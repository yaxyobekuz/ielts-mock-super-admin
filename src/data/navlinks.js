const navlinks = [
  {
    label: "Asosiy",
    link: "",
    allowed: ["owner", "admin"],
  },
  {
    label: "Foydalanuvchilar",
    link: "users",
    allowed: ["owner", "admin"],
  },
  {
    label: "Ustozlar",
    link: "teachers",
    allowed: ["owner", "admin"],
  },
  {
    label: "Testlar",
    link: "tests",
    allowed: ["owner", "admin"],
  },
  {
    label: "Javoblar",
    link: "submissions",
    allowed: ["owner", "admin"],
  },
  {
    label: "Natijalar",
    link: "results",
    allowed: ["owner", "admin"],
  },
  {
    label: "Havolalar",
    link: "links",
    allowed: ["owner", "admin"],
  },
  {
    label: "Statistika",
    link: "statistics/weekly",
    allowed: ["owner", "admin"],
  },
  {
    label: "Asboblar",
    link: "tools",
    allowed: [],
  },
  {
    label: "Shablonlar",
    link: "templates",
    allowed: ["owner", "admin"],
  },
];

export const getNavlinksByRole = (role) => {
  return navlinks.filter(({ allowed }) => allowed.includes(role));
};

export default navlinks;
