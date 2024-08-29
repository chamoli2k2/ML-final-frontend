import { BrowserRouter, Routes, Route } from "react-router-dom";
import DiseasePredictorPage from "./pages/DiseasePredictionPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DiseasePredictorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
