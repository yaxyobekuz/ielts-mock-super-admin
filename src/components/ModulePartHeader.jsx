const ModulePartHeader = ({ part, duration, partNumber }) => {
  return (
    <header className="flex items-center justify-between w-full h-20 bg-gray-100 py-3 px-4 mb-5 rounded-xl border border-gray-200">
      <div>
        <h1 className="mb-1 text-base font-bold">
          {part.title ? part.title : `Qism ${partNumber}`}
        </h1>
        <p>{part.description ? part.description : `Qism izohi`}</p>
      </div>

      <p className="text-gray-500">{duration} minutes</p>
    </header>
  );
};

export default ModulePartHeader;
