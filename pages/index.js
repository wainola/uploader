import React, { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      const {
        payload: { currentProgress, size },
      } = action;
      const difference = state.files[size].size - currentProgress;
      return {
        ...state,
        files: {
          ...state.files,
          [size]: {
            ...state.files[size],
            progress: currentProgress,
            difference,
          },
        },
      };
    case 'FIRST_LOADING':
      const { payload: filesData } = action;
      return {
        ...state,
        files: {
          ...state.files,
          [filesData.size]: { ...filesData },
        },
      };
    case 'LOAD_END':
      const {
        payload: { currentProgress: currentFinalProgress, size: finalSize },
      } = action;
      const finalDifference =
        state.files[finalSize].size - currentFinalProgress;
      return {
        ...state,
        files: {
          ...state.files,
          [finalSize]: {
            ...state.files[finalSize],
            progress: currentFinalProgress,
            difference: finalDifference,
          },
        },
      };
    default:
      break;
  }
};

export default function Home() {
  const initState = {
    files: {},
  };

  const [state, dispatcher] = useReducer(reducer, initState);

  const handleChange = (evt) => {
    const {
      target: { files },
    } = evt;

    const filesArray = Array.from(files);

    filesArray.forEach((file) => {
      dispatcher({
        type: 'FIRST_LOADING',
        payload: {
          size: file.size,
          name: file.name,
        },
      });
      const reader = new FileReader();

      reader.addEventListener('progress', (e) => {
        dispatcher({
          type: 'LOADING',
          payload: {
            currentProgress: parseInt(e.loaded, 10),
            size: e.total,
          },
        });
      });

      reader.addEventListener('loadend', (e) => {
        dispatcher({
          type: 'LOAD_END',
          payload: { currentProgress: parseInt(e.loaded, 10), size: e.total },
        });
      });

      reader.readAsText(file);
    });
  };

  console.log(state.files);

  const handleSubmit = (evt) => {
    evt.preventDefault();
  };

  const renderProgressBar = () => {
    const { files } = state;

    return (
      Object.keys(files) &&
      Object.keys(files).map((fileKey) => {
        const { progress, size } = files[fileKey];
        const percentage = Math.trunc((progress * 100) / size) || 0;

        return (
          <li className="ml-8 mr-8 mb-4">
            <div className="w-full h-8 rounded-lg">
              <div
                className="bg-red-500 h-8 rounded-lg"
                style={{ width: `${percentage}%` }}
              >
                <span className="flex flex-row justify-end mr-2 items-center text-white h-8">
                  {`${percentage}%`}
                </span>
              </div>
            </div>
          </li>
        );
      })
    );
  };

  return (
    <div className="flex flex-col h-screen ml-8 mr-8">
      <div className="h-screen">
        <div className="flex flex-row justify-center h-1/5 w-full items-center text-3xl text-blue-400">
          <h1>Uploader</h1>
        </div>

        <div className="flex flex-col h-1/5 w-full border-2 p-4 rounded-lg border-purple-400">
          <div className="flex flex-col h-full">
            <form
              onSubmit={handleSubmit}
              action=""
              className="flex flex-col justify-center items-center h-full"
            >
              <div className="flex flex-row w-full h-3/5 justify-center items-center">
                <input
                  type="file"
                  onChange={handleChange}
                  multiple="multiple"
                />
              </div>
              <div className="flex flex-row w-full h-3/6 justify-center items-end">
                <button
                  type="submit"
                  className="border-2 pl-4 pr-4 pt-1 pb-1 rounded-lg border-blue-400"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="fle flex-col h-2/5 w-full mt-8 mb-8 border-2 border-green-400 rounded-lg">
          <div className="flex flex-row justify-center mt-8">
            <h2>Files Loaded</h2>
          </div>
          <div className="flex flex-row justify-center mt-8 w-full">
            <ul className="w-full">{renderProgressBar()}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
