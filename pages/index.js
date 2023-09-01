import * as XLSX from 'xlsx';
import { useState } from 'react';

export default function Home() {

  const [file, setfile] = useState(null)


  async function startConverting() {
    let fileInput = document.getElementById("upload");
    let f = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const csvData = XLSX.utils.sheet_to_csv(ws, { header: 1 });

      const lines = csvData.split("\n");
      let subtitleText = "";

      for (let i = 1, j = 1; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.trim() === "") continue;

        let lineSplit = line.split(",");
        let subTitleData = {
          startTime: lineSplit[0].replace(".", ","),
          endTime: lineSplit[1].replace(".", ","),
          text: lineSplit[2]
        };

        subtitleText += `${j}\n${subTitleData.startTime} --> ${subTitleData.endTime}\n${subTitleData.text}\n\n`;
        j++;
      }

      const blob = new Blob([subtitleText], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "subtitles.srt";

      link.click();
    };
    reader.readAsBinaryString(f);
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <p className='text-5xl font-bold text-black'>XLSX TO .SRT</p>
      <a className='mt-1 underline cursor-pointer' href='/SubtitleTemplate.xlsx' download>Download the template here</a>

      <div className="flex items-center flex-col gap-8 mt-10">
        <input onChange={() => setfile(true)} id="upload" type="file" />
        {file && <button className='bg-black font-bold w-fit px-3 py-2 text-white' onClick={startConverting}>CONVERT</button>}
      </div>

      <p className='absolute bottom-0 mb-6 font-bold opacity-60'>Made by the sloth from New Designers 🦥</p>
    </div>
  )
}
