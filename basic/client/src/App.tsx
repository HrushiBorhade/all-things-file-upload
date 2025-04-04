import { useState } from 'react';

const App = () => {
  const [uploaded, setUploaded] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('file') as HTMLInputElement;
    
    if (fileInput && fileInput.files) {
      formData.append('file', fileInput.files[0]);
    }

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploaded(true);
        console.log('File uploaded successfully');
      } else {
        console.log('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-neutral-100 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-100 flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold underline underline-offset-4 decoration-yellow-500">File Uploads</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file">Upload file</label>
          <input 
            className="block w-full cursor-pointer text-gray-900 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2cursor-pointer bg-neutral-50 dark:text-neutral-400 focus:outline-none dark:bg-neutral-900 dark:border-neutral-600 dark:placeholder-neutral-400 hover:border-gray-500 dark:hover:border-gray-600 focus:ring-2 focus:ring-gray-500"
            id="file" 
            name="file"
            type="file" 
          />
        </div>
        <button 
          type="submit" 
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Upload
        </button>
      </form>
      {uploaded && <p>File uploaded successfully!</p>}
    </div>
  );
};

export default App;
