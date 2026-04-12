import { createRoot } from "react-dom/client";
import App from "./App";
// Lightbox
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
// Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./reset.css";
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
