import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className="flex flex-col h-screen ml-8 mr-8">
      <div className="h-screen">
        <div className="flex flex-row justify-center h-1/5 w-full items-center text-3xl text-blue-400">
          <h1>Uploader</h1>
        </div>

        <div className="flex flex-col h-1/5 w-full border-2 p-4 rounded-lg border-purple-400">
          <div className="flex flex-col h-full">
            <form
              action=""
              className="flex flex-col justify-center items-center h-full"
            >
              <input type="file" />
              <button>Upload</button>
            </form>
          </div>
        </div>

        <div>
          <div>
            <h2>Files</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
