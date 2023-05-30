import {TextBox } from "devextreme-react/text-box";
import { useState, useRef } from "react";
import { Calendar } from "devextreme-react/calendar";
import { Popup } from "devextreme-react/popup";
import * as React from "react";

// To convert the date selected from the calendar or date comimng in the props into MM/DD/YYYY format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;
  //const formattedDate = date.toLocaleDateString('en-US');
  return formattedDate;
};

function DateTextBox(props) {
  const [date, setDate] = useState(props.value ? formatDate(props.value) : "");
  const [errorMessage, setErrorMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  const isCalendarRequired = props.isCalendarRequired;
  const isClearRequired = props.isClearRequired;
  const minDate = props.minimumDate;
  const maxDate = props.maximumDate;

  const calendarRef = useRef(null);
  const textBoxRef = useRef(null);
  const buttonRef = useRef(null);

  // const getMaxDate = () => {
  //   if (!props.isFutureRequired) {
  //     return new Date(); // Set max date as the current date
  //   }
  //   return null; // Allow all dates
  // };

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
    const _minDate = new Date(minDate);
    const _maxDate = new Date(maxDate);
    //const currentDate = new Date();

    if (originalValue.trim() !== "") {
      // Validate the date format
      const dateRegex =
        "^((0[13578]|1[02])[/.]31[/.](18|19|20)[0-9]{2})|((01|0[3-9]|1[1-2])[/.](29|30)[/.](18|19|20)[0-9]{2})|((0[1-9]|1[0-2])[/.](0[1-9]|1[0-9]|2[0-8])[/.](18|19|20)[0-9]{2})|((02)[/.]29[/.](((18|19|20)(04|08|[2468][048]|[13579][26]))|2000))$";
      const regexExp = new RegExp(dateRegex);
      let status = regexExp.test(originalValue);

      if (!status) {
        setErrorMessage("Invalid date format (MM/DD/YYYY)");
        setDate(originalValue);
        return;
      }

      // // Validate the date value for future date only if future date validation is required
      // if (!props.isFutureRequired) {
      //   if (inputDate > currentDate) {
      //     setErrorMessage("Date cannot be in the future");
      //     setDate(originalValue);
      //     return;
      //   }
      // }

      // Validate the date value for minimum date only if minimum date validation is required

      //if (minDate && originalValue < minDate) {
      if (minDate && inputDate < _minDate) {
        setErrorMessage("Date cannot be beyond minimum date set");
        setDate(originalValue);
        return;
      }

      // Validate the date value for maximum date only if maximum date validation is required

      if (maxDate && inputDate > _maxDate) {
        if (!props.isFutureRequired) {
            setErrorMessage("Date cannot be in the future");
        }
        setErrorMessage("Date cannot be greater than the maximum date set");
        setDate(originalValue);
        return;
      }

      setDate(originalValue);
      setErrorMessage("");

      //to update 2nd textbox with the value from 1st DateTextbox on entering date manually
      if (props.onDateChange) {
        props.onDateChange(originalValue); // Notify parent component of the date change
      }
    } else {
      if (props.isRequired) {
        setErrorMessage(props.name + " cannot be empty");
        setDate(originalValue);
        return;
      }
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
        props.onDateChange(""); // Notify parent component of the date change for clearing the text box
      }
    }
  };
  // To fill the textbox with the date selected from the calendar in MM/DD/YYYY format
  // const handleCalendarValueChanged = (e, textBoxRef) => {
  //   if (e.value instanceof Date) {
  //     const formattedDate = formatDate(e.value);
  //     textBoxRef.current.instance.option("value", formattedDate);
  //     setDate(formattedDate);
  //     //setShowCalendar(!showCalendar);
  //     setPopupVisible(false); // to hide the calendar on selection

  //     if (props.onDateChange) {
  //       props.onDateChange(formattedDate); // Notify parent component of the date change for updating it's value to other DatetextBox of the parent component
  //     }

  //     if (textBoxRef.current) {
  //       textBoxRef.current.instance.focus();
  //     }
  //   }
  // };

  const handleCalendarValueChanged = (e, textBoxRef) => {
    if (e.value instanceof Date) {
      const formattedDate = formatDate(e.value);
      textBoxRef.current.instance.option("value", formattedDate);
      setDate(formattedDate);
      setPopupVisible(false); // to hide the calendar on selection
  
      if (props.onDateChange) {
        props.onDateChange(formattedDate); // Notify parent component of the date change for updating its value to other DateTextBox of the parent component
      }
  
      if (textBoxRef.current) {
        textBoxRef.current.instance.focus();
      }
    }
    // if (calendarRef.current) {
    //   calendarRef.current.instance.onInitialized(); // Call onInitialized function of the Calendar component
    // }
  };
  
                                          
  return (
    <>
      {isCalendarRequired ? (
        <div className="input-group">
          <div style={{ display: "flex" }}>
            <TextBox
              value={date ? date : props.value}
              ref={textBoxRef}
              placeholder={props.placeholder}
              onFocusOut={handleDateChange}
              maxLength={10}
              width="180px"
              mode="text"
              valueChangeEvent="keyup blur"
              onValueChanged={handleValueChange}
              onKeyPress={handleKeyPress}
              style={{ flex: "1 1 auto" }} //grow and shrink text box as needed.so that that the clear button and calendar button stay on the same line.
            />
            {date && isClearRequired ? (
              <button
                tabIndex={-1} // to make button unfocusable using the Tab key
                onClick={handleClearClick}
                className="clear-button"
              >
                <i className="fa fa-close" />
              </button>
            ) : null}

            <button
              ref={buttonRef}
              tabIndex={-1}
              onClick={handleCalendarClick}
              className="btn btn-outline-secondary calendar-button"
            >
              <span className="fa fa-calendar-alt"></span>
            </button>
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
              // max={!props.isFutureRequired ? new Date(): maxDate ? maxDate : ''}
              max={maxDate ? maxDate : ""}  
              min={minDate ? minDate : ""}            
            />
          </Popup>
        </div>
      ) : (
        <TextBox
          value={date ? date : props.value}
          ref={textBoxRef}
          onFocusOut={handleDateChange}
          placeholder={props.placeHolder}
          maxLength={10}
          mode="text"
          valueChangeEvent="keyup blur"
          onValueChanged={handleValueChange}
          onKeyPress={handleKeyPress}
          isRequired={props.isRequired}
        />
      )}

      <div>
        <p>{errorMessage}</p>
      </div>
    </>
  );
}
export default DateTextBox;
