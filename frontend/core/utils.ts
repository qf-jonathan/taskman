import { AxiosError } from "axios";

export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Invalid email address",
};

export const errorDetail = (error: AxiosError | unknown): string => {
  if (error && error instanceof AxiosError && error.response) {
    return error.response.data.detail;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  console.error(error);
  return "unknown error";
};

export const getISODate = (datetime?: string): string | undefined => {
  if (!datetime?.match(/^\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}$/)) {
    return undefined;
  }
  const [date, time] = datetime.split(" ");
  const [month, day, year] = date.split("/").map(Number);
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds)
  ).toISOString();
};

export const getLocalDate = (date?: string): string => {
  try {
    return new Date(date ?? "").toLocaleString();
  } catch (error) {
    return "";
  }
};

function leadingZeros(num: number, width: number) {
  return num.toString().padStart(width, "0");
}

export const getInputDate = (date?: string): string => {
  try {
    const dateData = new Date(date ?? "");
    if (dateData.toString() === "Invalid Date") {
      return "";
    }
    return `${leadingZeros(dateData.getMonth() + 1, 2)}/${leadingZeros(
      dateData.getDate(),
      2
    )}/${leadingZeros(dateData.getFullYear(), 2)} ${leadingZeros(
      dateData.getHours(),
      2
    )}:${leadingZeros(dateData.getMinutes(), 2)}:${leadingZeros(
      dateData.getSeconds(),
      2
    )}`;
  } catch (error) {
    return "";
  }
};
