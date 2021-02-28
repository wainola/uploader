import React, { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      const { payload: currentProgress } = action;
      return {
        ...state,
        progress: currentProgress,
      };
    case 'FIRST_LOADING':
      const { payload: size } = action;
      return {
        ...state,
        size,
      };
    default:
      break;
  }
};

export default function Home() {
  const initState = {
    progress: 0,
  };

  const [state, dispatcher] = useReducer(reducer, initState);

  const handleChange = (evt) => {
    const {
      target: { files },
    } = evt;
    console.log(files);

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
    });

    reader.addEventListener('load', (e) => {
      console.log(`${e.type} - ${e.loaded}`);
    });

    for (let i = 0; i < files.length; i++) {
      reader.readAsText(files[i]);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
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

        <div>
          <div>
            <h2>Files Loaded</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
