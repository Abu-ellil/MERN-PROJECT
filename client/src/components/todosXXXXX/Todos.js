import backgroundImage from "../assets/main-cover.png";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

const Todos = () => {
  return (
    <div
      className="main-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        height: "20vh",
      }}
    >
      {/* {signedIn ? <h1>hiiiiiiiiiiiii</h1> : <h1>you are not allowed</h1>} */}

      <Routes>
        <Route path="/" element={<All />} />
        <Route path="/active" element={<Active />} />
        <Route path="/completed" element={<Completed />} />
      </Routes>
    </div>
  );
};
export default Todos;
