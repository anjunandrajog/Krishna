import "./App.css";
import { DateTextBox } from "./lib";
//DevExtreme Styles
import "../src/lib/assets/lib/devexpress/css/dx.common.css";
import "../src/lib/assets/lib/devexpress/css/dx.light.css";
//Fort Awesome Icons
import "../src/lib/assets/lib/fortawesome/embedded-woff.css";

function App() {
  return (
    <DateTextBox
      //value="4 June 2023"
      placeholder="MM/DD/YYYY"
      isRequired={true}
      allowAutoSelection={false}
      isCalendarRequired={true}
      isClearRequired={true}
      //allowFutureDates={false}
      maximumDate="4 June 2023"
      minimumDate="04/01/2023"
      //futureError="Future Date is not allowed."
      maxDateError="Crossing the maximum Date set."
      minDateError="Date can't be lesser than minimum Date set."
      // isRequiredError="This field is mandatory"
      invalidDateError="Please enter the valid date"
      //isReadOnly={true}
    />
    //<DateTextBox/>
  );
}

export default App;
