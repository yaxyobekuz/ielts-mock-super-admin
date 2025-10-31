// React
import { useEffect } from "react";

// Icons
import { ArrowLeft } from "lucide-react";

// Api
import { testsApi } from "@/api/tests.api";

// Hooks
import useModule from "@/hooks/useModule";
import useObjectState from "@/hooks/useObjectState";
import usePathSegments from "@/hooks/usePathSegments";

// Router
import { Link, Outlet, useParams } from "react-router-dom";

// Components
import Nav from "@/components/Nav";
import PageInfo from "@/components/PageInfo";
import MainBgLoader from "@/components/loaders/MainBgLoader";

// Animations
import sadDuckAnimation from "@/assets/animated/duck-sad-out.json";

const TestLayout = () => {
  const { testId } = useParams();
  const { pathSegments } = usePathSegments();

  const module = pathSegments[3];
  const { getModuleData, setModule } = useModule(module, testId);

  const { parts } = getModuleData() || {};
  const { setField, isLoading, error } = useObjectState({
    error: null,
    isLoading: !parts,
  });

  const loadTest = () => {
    setField("error", null);
    setField("isLoading", true);

    testsApi
      .getById(testId)
      .then(({ code, test }) => {
        if (code !== "testFetched") throw new Error();

        setModule(test.reading, test._id, "reading");
        setModule(test.writing, test._id, "writing");
        setModule(test.listening, test._id, "listening");
      })
      .catch(({ message }) => {
        setField("error", message || "Nimadir xato ketdi");
      })
      .finally(() => setField("isLoading"));
  };

  useEffect(() => {
    !parts && loadTest();
  }, [testId]);

  // Loader
  if (isLoading) return <MainBgLoader />;

  // Error content
  if (error) {
    return (
      <PageInfo
        title={error}
        allowFullScreen
        animation={sadDuckAnimation}
        links={{
          primary: { to: "/tests", body: "Testlar sahifasiga qaytish" },
        }}
      />
    );
  }

  // Main content
  return (
    <>
      <ModulesNavbar testId={testId} />

      <main className="pb-[41px]">
        <Outlet />
      </main>

      <PartsNavbar parts={parts} testId={testId} module={module} />
    </>
  );
};

const ModulesNavbar = ({ testId }) => {
  const to = (m) => `tests/${testId}/preview/${m}/1`;

  return (
    <div className="flex items-center gap-3.5 sticky top-0 inset-x-0 z-20 container h-14 bg-white">
      <Link
        to={`/tests/${testId}`}
        className="btn shrink-0 size-11 bg-gray-100 p-0 rounded-full hover:bg-gray-200"
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
      </Link>

      <Nav
        fullSizeBtn
        pagePathIndex={3}
        className="w-full"
        links={[
          { label: "Listening", link: to("listening") },
          { label: "Reading", link: to("reading") },
          { label: "Writing", link: to("writing") },
        ]}
      />
    </div>
  );
};

const PartsNavbar = ({ testId, module, parts }) => (
  <div className="flex items-center fixed z-20 bottom-0 inset-x-0 container h-14 bg-white">
    <Nav
      fullSizeBtn
      pagePathIndex={4}
      className="w-full"
      links={parts?.map(({ number }) => ({
        label: `Part ${number}`,
        link: `tests/${testId}/preview/${module}/${number}`,
      }))}
    />
  </div>
);

export default TestLayout;
