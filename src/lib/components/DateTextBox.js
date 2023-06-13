import { TextBox } from "devextreme-react/text-box";
import { useState, useRef, useEffect } from "react";
import { Calendar } from "devextreme-react/calendar";
import { Popup } from "devextreme-react/popup";
import * as React from "react";
import "../assets/css/customDateBox-styles.css";

// To convert the date selected from the calendar or date comimng in the props into MM/DD/YYYY format
const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }
  return;
};

function DateTextBox(props) {
  const [name, setName] = useState(props.name ? props.name : " ");

  const [date, setDate] = useState(props.value ? formatDate(props.value) : "");
  const [errorMessage, setErrorMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [maxDate, setMaxDate] = useState(
    props.maximumDate ? new Date(props.maximumDate) : null
  );
  const [minDate, setMinDate] = useState(
    props.minimumDate ? new Date(props.minimumDate) : null
  );
  const [isCalendarRequired, setisCalendarRequired] = useState(
    props.isCalendarRequired ? props.isCalendarRequired : null
  );
  const [allowFutureDates, setallowFutureDates] = useState(
    props.allowFutureDates !== undefined && props.allowFutureDates === false
      ? false
      : true
  );
  const [allowAutoSelection, setAllowAutoSelection] = useState(
    props.allowAutoSelection !== undefined && props.allowAutoSelection === true
      ? true
      : false
  );
  const [isRequired, setisRequired] = useState(
    props.isRequired !== undefined && props.isRequired === true ? true : false
  );
  const [isClearRequired, setisClearRequired] = useState(
    props.isClearRequired !== undefined && props.isClearRequired === true
      ? true
      : false
  );
  const [isReadOnly, setisReadOnly] = useState(
    props.isReadOnly !== undefined && props.isReadOnly === true ? true : false
  );

  const calendarRef = useRef(null);
  const textBoxRef = useRef(null);
  const buttonRef = useRef(null);

  const errorStyle = {
    color: "red",
  };

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px",
  };

  const getMaxDate = () => {
    //To allow future date selection
    if (allowFutureDates) {
    }
    //To restrict future dates, do not allow user to select date greater than current date
    else {
      return new Date(); // Set max date as the current date
    }

    //To restrict date greater than max date
    if (maxDate) {
      return maxDate;
    }
    return null; // Allow all dates
  };

  const handleCalendarClick = () => {
    setErrorMessage("");
    setPopupVisible(true);
  };
  const handlePopupHidden = () => {
    setPopupVisible(false);
  };

  const handleClearClick = (e) => {
    // Delay for clearing the text box value as this event was not getting captured due to onFocusOut event of textbox
    setTimeout(() => {
      if (textBoxRef.current) {
        setDate(""); // clear the TextBox
        setErrorMessage(""); // clear the error message
        if (props.onDateChange) {
          props.onDateChange(""); // Notify parent component of the date change for clearing this & other DateBoxComponent of the parent component
        }
      }
    }, 100);

    if (textBoxRef.current) {
      textBoxRef.current.instance.focus();
    }
  };

  const handleKeyPress = (e) => {
    const keyCode = e.event.which || e.event.code;
    const keyValue = String.fromCharCode(keyCode);
    const regex = /^[0-9/]*$/; // Only allow numeric characters and /

    if (!regex.test(keyValue)) {
      // Prevent non-numeric characters from being entered
      e.event.preventDefault();
    }
  };

  const handleDateChange = (e) => {
    let originalValue = e.component?.option("value");
    const inputDate = new Date(originalValue);
    const currentDate = new Date();

    if (originalValue.trim() !== "") {
      // Validate the date format
      const dateRegex =
        "^((0[13578]|1[02])[/.]31[/.](18|19|20)[0-9]{2})|((01|0[3-9]|1[1-2])[/.](29|30)[/.](18|19|20)[0-9]{2})|((0[1-9]|1[0-2])[/.](0[1-9]|1[0-9]|2[0-8])[/.](18|19|20)[0-9]{2})|((02)[/.]29[/.](((18|19|20)(04|08|[2468][048]|[13579][26]))|2000))$";
      const regexExp = new RegExp(dateRegex);
      let status = regexExp.test(originalValue);

      if (!status) {
        if (props.invalidDateError) {
          setErrorMessage(props.invalidDateError);
        } else {
          setErrorMessage("Enter valid date");
        }
        setDate(originalValue);
        return;
      }

      // Validate the date value for minimum date only if minimum date validation is required
      if (minDate && inputDate < minDate) {
        if (props.minDateError) {
          setErrorMessage(props.minDateError);
        } else {
          setErrorMessage("Date cannot be smaller than the minimum date set");
        }
        setDate(originalValue);
        return;
      }

      // Validate the date value for maximum date only if maximum date validation is required

      if (maxDate && inputDate > maxDate) {
        if (props.maxDateError) {
          setErrorMessage(props.maxDateError);
        } else {
          setErrorMessage("Date cannot be beyond maximum date set");
        }
        setDate(originalValue);
        return;
      }

      if (!allowFutureDates && inputDate > currentDate) {
        if (props.futureError) {
          setErrorMessage(props.futureError);
        } else {
          setErrorMessage("Future date is not allowed");
        }
        setDate(originalValue);
        return;
      }
    } else {
      if (isRequired) {
        if (props.isRequiredError) {
          setErrorMessage(props.isRequiredError);
        } else {
          setErrorMessage("Field is required.");
        }
        setDate(originalValue);
        return;
      }
    }
    if (props.onDateChange) {
      props.onDateChange(originalValue); // Notify parent component of the date change
    }
    if (textBoxRef.current) {
      textBoxRef.current.instance.focus();
    }
  };

  // To append / to the numbers entered & convert into  MM/DD/YYYY format.
  const handleValueChange = (e) => {
    let text = e.value;

    if (e.previousValue?.length < e.value?.length) {
      if (text && text?.length === 2 && !text.includes("/")) {
        text = `${text}/`;
      }
      if (text && text?.length === 5) {
        text = `${text}/`;
      }
      if (text?.length === 0) {
        text = null;
      }
      e.component.option("value", text);
      textBoxRef.current.instance.option("value", text); // Update the TextBox value using the option method
      setDate(text);
    } else {
      setDate(e.value); //To update the dateTextBox while doing backspace

      //to update 2nd textbox with the value from 1st DateTextbox on entering date manually
      if (props.onDateChange) {
        props.onDateChange(text); // Notify parent component of the date change for clearing the text box
      }
    }
  };

  // To fill the textbox with the date selected from the calendar in MM/DD/YYYY format
  const handleCalendarValueChanged = (e, textBoxRef) => {
    if (e.value instanceof Date) {
      const formattedDate = formatDate(e.value);
      textBoxRef.current.instance.option("value", formattedDate);
      setDate(formattedDate);
      setPopupVisible(false); // to hide the calendar on selection

      if (props.onDateChange) {
        props.onDateChange(formattedDate); // Notify parent component of the date change for updating its value to other DateTextBox of the parent component
      }
    }

    if (textBoxRef.current) {
      textBoxRef.current.instance.focus();
    }
  };

  useEffect(() => {
    if (textBoxRef.current && allowAutoSelection) {
      const { value } = textBoxRef.current;
      if (value) {
        textBoxRef.current.setSelectionRange(0, value.length);
      }
    }
  }, []);

  return (
    <>
      <div>
        <div className="custom-datebox">
          <TextBox
            value={date ? date : formatDate(props.value)}
            ref={textBoxRef}
            placeholder={props.placeholder}
            onFocusOut={handleDateChange}
            maxLength={10}
            mode="text"
            valueChangeEvent="keyup blur"
            onValueChanged={handleValueChange}
            onKeyPress={handleKeyPress}
            style={{ flex: 1, border: "none" }} //grow and shrink text box as needed.so that that the clear button and calendar button stay on the same line.
            readOnly={isReadOnly}
            disabled={isReadOnly ? true : ""}
          />
          {date && isClearRequired ? (
            <button
              tabIndex={-1} // to make button unfocusable using the Tab key
              onClick={handleClearClick}
              disabled={isReadOnly ? true : ""}
              className="clear-button"
            >
              <i className="fa fa-close" />
            </button>
          ) : null}
          {isCalendarRequired ? (
            <button
              ref={buttonRef}
              tabIndex={-1}
              disabled={isReadOnly ? true : ""}
              onClick={handleCalendarClick}
              className="btn btn-outline-secondary calendar-button"
            >
              <span className="fa fa-calendar-alt"></span>
            </button>
          ) : null}
        </div>

        <Popup
          visible={popupVisible}
          onHiding={handlePopupHidden}
          target="buttonRef"
          closeOnOutsideClick={true}
          showTitle={false}
          width="auto"
          height="auto"
          position={{
            my: "bottom",
            at: "top",
            of: buttonRef.current,
            collision: "flip",
          }}
        >
          <Calendar
            ref={calendarRef}
            onInitialized={() => {}}
            onValueChanged={(e) => handleCalendarValueChanged(e, textBoxRef)}
            firstDayOfWeek={1}
            max={getMaxDate()}
            //max={maxDate ? maxDate : ""}
            min={minDate ? minDate : ""}
          />
        </Popup>
      </div>
      <div>
        <p style={errorStyle}>{errorMessage}</p>
      </div>
    </>
  );
}
export default DateTextBox;
