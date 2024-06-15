import "./App.css";
import FullScreen from "./components/FullScreen";
import Touchpad from "./components/Touchpad";

const App = () => {
  return (
    <div>
      <Touchpad />
      <FullScreen />
    </div>
  );
};

export default App;
