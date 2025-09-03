import { useState, useEffect } from "react";
import "./App.css";
import hand from "./assets/images/Adobe Express - file.png";

function App() {
  const [serverMessage, setServerMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setServerMessage(data.message))
      .catch((err) => {
        console.error(err);
        setServerMessage("Failed to connect to the server");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen">
        {/* Title */}
        <div className="absolute top-24 text-center">
          <h1 className="text-red-600 text-7xl font-light  leading-none tracking-tight -mb-8">
            CREATIVE
          </h1>
          <h1 className="text-red-600 text-7xl font-bold leading-tight tracking-tight">
            RELEASE
          </h1>
          

          {/* Hand image */}
          <div className="relative flex justify-center  animate-float mr-100  -mt-200">
            <img
              src={hand}
              alt="Hand"
              className="lg:w-[1600px] md:w-[1000] relative z-10"
            />
            
          </div>

          {/* Subtitle */}
         
        </div>
      </section>
    </div>
  );
}

export default App;
