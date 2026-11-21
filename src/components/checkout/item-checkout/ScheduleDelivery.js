import React, { useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CustomDatePicker } from "../CheckOut.style";
import {
  MenuItem,
  Select,
  styled,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import moment from "moment/moment";
import { getDayNumber } from "utils/CustomFunctions";

// Fixed 30-minute slots avoid a mobile text keyboard just to enter a time.
const TIME_SLOTS = Array.from({ length: 48 }, (_, index) => {
  const hours = String(Math.floor(index / 2)).padStart(2, "0");
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

const TimeSelect = styled(Select)(() => ({
  background: "rgba(118, 118, 128, 0.12)",
  borderRadius: "5px",
  fontSize: "14px",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": { padding: "5px 28px 5px 10px" },
}));

const MaterialUISwitch = styled(Switch)(({ theme, timeValue }) => ({
  width: 100,
  height: 30,
  padding: 0,

  "& .MuiSwitch-switchBase": {
    background: "rgba(118, 118, 128, 0.12)",
    margin: 2,
    padding: 0,
    transform: "translateX(2px)",
    "&.Mui-checked+": {
      "& .MuiSwitch-track": {
        background: "rgba(118, 118, 128, 0.12)",
        borderRadius: 5,
      },
    },

    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(45px)",
      "& .MuiSwitch-thumb:before": {
        content: `"${timeValue}"`,
        position: "absolute",

        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    background: "#fff",
    color: "#67513A",
    width: 48,
    height: 26,

    borderRadius: "5px",
    "&:before": {
      content: `"${timeValue}"`,
      position: "absolute",

      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    },
  },
  "& .MuiSwitch-track": {
    background: "rgba(118, 118, 128, 0.12)",
    borderRadius: 5,
  },
}));

const ScheduleDelivery = ({ customDispatch, scheduleTime, setDayNumber }) => {
  const [timeValue, setTimeValue] = useState("AM");
  const handleChange = (e) => {
    const input = e.target.value;
    const hour = parseInt(input.split(":")[0], 10);
    const amPm = hour >= 12 ? "PM" : "AM";
    const time = new Date(`2000-01-01 ${input}`); // Set an arbitrary date for parsing

    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    setTimeValue(amPm);
    customDispatch({
      type: "SET_SCHEDULE_TIME",
      payload: formattedTime,
    });
  };
  const handleChangeCheck = (event) => {
    if (event.target.checked) {
      customDispatch({ type: "SET_AMPM", payload: timeValue });
    } else {
      customDispatch({ type: "SET_AMPM", payload: timeValue });
    }
  };
  const handleDateChange = (newValue) => {
    const dayName = moment(newValue?.$d).format("dddd");
    const selectedDayNumber = getDayNumber(dayName);
    setDayNumber(selectedDayNumber);
    customDispatch({ type: "SET_SCHEDULE_MONTH", payload: newValue });
  };

  return (
    <CustomStackFullWidth p="1rem">
      {" "}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomDatePicker
          renderInput={(params) => <TextField {...params} />}
          onChange={(newValue) => handleDateChange(newValue)}
          disablePast
          views={["day"]}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          pr="1.25rem"
          pl="1.25rem"
          alignItems="center"
        >
          <Typography fontWeight="400" fontSize="16px">
            {t("Time")}
          </Typography>
          <Stack direction="row" spacing={1.7}>
            <TimeSelect
              value={scheduleTime || ""}
              displayEmpty
              inputProps={{ "aria-label": t("Time") }}
              renderValue={(value) =>
                value ? moment(value, "HH:mm").format("h:mm A") : t("Select time")
              }
              onChange={(e) => handleChange(e)}
            >
              {TIME_SLOTS.map((slot) => (
                <MenuItem key={slot} value={slot}>
                  {moment(slot, "HH:mm").format("h:mm A")}
                </MenuItem>
              ))}
            </TimeSelect>

            <MaterialUISwitch
              timeValue={timeValue}
              defaultChecked
              onChange={handleChangeCheck}
            />
          </Stack>
        </Stack>
      </LocalizationProvider>
    </CustomStackFullWidth>
  );
};

export default ScheduleDelivery;
