import React, { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      const { payload: currentProgress } = action;
      const difference = state.size - currentProgress;
      return {
        ...state,
        progress: currentProgress,
        difference,
      };
    case 'FIRST_LOADING':
      const { payload: size } = action;
      return {
        ...state,
        size,
      };
    case 'LOAD_END':
      const { payload: currentFinalProgress } = action;
      const finalDifference = state.size - currentFinalProgress;
      return {
        ...state,
        progress: currentFinalProgress,
        difference: finalDifference,
      };
    default:
      break;
  }
};

export default function Home() {
  const initState = {
    progress: 0,
    difference: 0,
    size: 0,
  };

  const [state, dispatcher] = useReducer(reducer, initState);

  const handleChange = (evt) => {
    const {
      target: { files },
    } = evt;

    dispatcher({ type: 'FIRST_LOADING', payload: files[0].size });

    const reader = new FileReader();

    reader.addEventListener('progress', (e) => {
      console.log(`${e.type} - ${e.loaded}`);
      dispatcher({
        type: 'LOADING',
        payload: parseInt(e.loaded, 10),
      });
    });
    reader.addEventListener('loadend', (e) => {
      console.log(`${e.type} - ${e.loaded}`);
      dispatcher({
        type: 'LOAD_END',
        payload: e.loaded,
      });
    });

    reader.addEventListener('load', (e) => {
      console.log(`${e.type} - ${e.loaded}`);
    });

    for (let i = 0; i < files.length; i++) {
      reader.readAsText(files[i]);
    }
  };

  console.log({ ...state });

  const handleSubmit = (evt) => {
    evt.preventDefault();
  };

  const renderProgressBar = () => {
    const { size, progress } = state;
    const percentage = Math.trunc((progress * 100) / size) || 0;
    console.log('percentage', percentage);
    return (
      <div className="w-full h-8 ml-8 mr-8 rounded-lg">
        <div
          className="bg-red-500 h-8 rounded-lg"
          style={{ width: `${percentage}%` }}
        >
          <span className="flex flex-row justify-end mr-2 items-center text-white h-8">
            {`${percentage}%`}
          </span>
        </div>
        <div className="w-3/6 h-8 rounded-lg"></div>
      </div>
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
          <div className="flex flex-row justify-center mt-8">
            {renderProgressBar()}
          </div>
        </div>
      </div>
    </div>
  );
}
