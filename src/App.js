import "./App.css";
import { DateTextBox } from "./lib";
//DevExtreme Styles
import '../src/lib/assets/lib/devexpress/css/dx.common.css'
import '../src/lib/assets/lib/devexpress/css/dx.light.css';
//Fort Awesome Icons
import '../src/lib/assets/lib/fortawesome/embedded-woff.css';

function App() {
  return (
    <DateTextBox
      name="Document Date From"
      value=''
      placeholder="MM/DD/YYYY"
      isRequired={true}
      isCalendarRequired={true}
      isClearRequired={true}
      isFutureRequired={false}
     //maximumDate = "05/06/2023"
      minimumDate="01/01/2023"
    />
  );
}

export default App;
