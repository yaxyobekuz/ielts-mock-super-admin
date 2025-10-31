// React
import { useMemo } from "react";

// Router
import { useParams } from "react-router-dom";

// Data
import questionsType from "@/data/questionsType";

// Hooks
import useModule from "@/hooks/useModule";
import usePathSegments from "@/hooks/usePathSegments";

// Components
import ModulePartHeader from "@/components/ModulePartHeader";
import RichTextPreviewer from "@/components/RichTextPreviewer";
import TextDraggable from "@/components/questions/TextDraggable";

const questionsMap = {};
questionsType.forEach((q) => (questionsMap[q.value] = q.component));
const TextComponent = questionsMap["text"];

const Reading = () => {
  const { partNumber, testId } = useParams();
  const { pathSegments } = usePathSegments();
  const module = pathSegments[3];

  const { getModuleData } = useModule(module, testId);
  const { parts, duration } = getModuleData() || {};

  // Calculate current part and cumulative question count
  const { currentPart, cumulativeQuestions } = useMemo(() => {
    const partNum = parseInt(partNumber);
    const part = parts?.find((p) => p.number === partNum);
    const cumulative = parts
      ?.slice(0, partNum - 1)
      ?.reduce((acc, part) => acc + part.totalQuestions, 0);

    return {
      currentPart: part,
      cumulativeQuestions: cumulative,
    };
  }, [parts, partNumber, module]);

  const { sections, text } = currentPart || {};

  // Return error if part not found
  if (!currentPart) {
    return (
      <div className="container">
        <div className="py-8">
          <div className="w-full bg-red-50 py-3 px-4 mb-5 rounded-xl border border-red-300">
            <p className="text-red-700">Part not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-5">
      <ModulePartHeader
        module={module}
        testId={testId}
        part={currentPart}
        duration={duration}
        partNumber={partNumber}
      />

      {/* Main */}
      <div className="grid grid-cols-2 gap-3.5 pb-5">
        <div className="space-y-5">
          {/* Splitted sections text */}
          {sections?.map((section, index) => {
            const initialNumber =
              sections
                .slice(0, index)
                .reduce((acc, sec) => acc + sec.questionsCount, 0) +
              cumulativeQuestions +
              1;

            if (section.type !== "text-draggable" || !section.splitAnswers) {
              return;
            }

            return (
              <div className="w-full bg-gray-50 p-5 rounded-xl border">
                <TextDraggable
                  onlyShowText
                  allowDropzone
                  key={section._id}
                  text={section.text}
                  coords={section.coords}
                  initialNumber={initialNumber}
                />
              </div>
            );
          })}

          {/* Part text */}
          <div className="w-full bg-gray-50 p-5 rounded-xl border">
            <TextComponent text={text} initialNumber={0} />
          </div>
        </div>

        {/* Sections content */}
        <div className="w-full">
          {sections?.map((section, index) => {
            const prevSectionsTotalQuestions = sections
              .slice(0, index)
              .reduce((acc, sec) => acc + sec.questionsCount, 0);

            return (
              <Section
                index={index}
                module={module}
                testId={testId}
                section={section}
                partNumber={partNumber}
                key={`${section.questionType}-${index}`}
                initialQuestionNumber={
                  prevSectionsTotalQuestions + cumulativeQuestions + 1
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Section = ({
  index,
  testId,
  module,
  section,
  partNumber,
  initialQuestionNumber,
}) => {
  const { description, type, _id } = section;
  const QuestionComponent = questionsMap[type];

  return (
    <section
      id={`s-${index}`}
      className="mb-6 px-5 py-4 bg-gray-50 rounded-xl border last:mb-0"
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-5">
        {/* Section details */}
        <div className="mb-4 space-y-2">
          <h2 className="font-bold">
            Questions {initialQuestionNumber} -{" "}
            {initialQuestionNumber + section.questionsCount - 1}{" "}
            <span className="font-normal text-gray-500">({section.type})</span>
          </h2>

          <RichTextPreviewer text={description} />
        </div>
      </div>

      {/* Main */}
      {QuestionComponent ? (
        <QuestionComponent {...section} initialNumber={initialQuestionNumber} />
      ) : (
        <div className="bg-gray-50 border rounded p-4 text-yellow-800">
          Unknown question type: {type}
        </div>
      )}
    </section>
  );
};

export default Reading;
