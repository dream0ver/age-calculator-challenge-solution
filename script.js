import moment from "https://cdn.jsdelivr.net/npm/moment@2.29.4/+esm"
export const onLoad = () => {
  let buttonEnabled = false
  const DAY30_MONTHS = [4, 6, 9, 11]
  const DAY31_MONTHS = [1, 3, 5, 7, 8, 10, 12]
  const month_input = document.getElementById("month_input")
  const day_input = document.getElementById("day_input")
  const year_input = document.getElementById("year_input")
  const button = document.getElementById("calculate_button")

  const isDayValid = (d, m, y) => {
    return (
      (DAY30_MONTHS.includes(m) && d <= 30) ||
      (DAY31_MONTHS.includes(m) && d <= 31) ||
      (m == 2 && y % 4 == 0 && d <= 29) ||
      (m == 2 && y % 4 != 0 && d <= 28)
    )
  }
  const setResult = (y, m, d) => {
    document
      .getElementById("result")
      .getElementsByTagName("span")[0].innerText = y
    document
      .getElementById("result")
      .getElementsByTagName("span")[1].innerText = m
    document
      .getElementById("result")
      .getElementsByTagName("span")[2].innerText = d
  }
  const fetchValues = () => {
    const d = day_input.getElementsByTagName("input")[0].value
    const m = month_input.getElementsByTagName("input")[0].value
    const y = year_input.getElementsByTagName("input")[0].value
    return { d, m, y }
  }
  const onButtonClick = () => {
    if (!buttonEnabled) {
      day_input.classList.add("err")
      month_input.classList.add("err")
      year_input.classList.add("err")
      day_input.getElementsByTagName("span")[0].innerText =
        "This field is required !"
      month_input.getElementsByTagName("span")[0].innerText =
        "This field is required !"
      year_input.getElementsByTagName("span")[0].innerText =
        "This field is required !"
      return
    }
    const { d, m, y } = fetchValues()
    const input = moment([y, m - 1, d])
    const diff = moment().diff(input, "milliseconds")
    const duration = moment.duration(diff)
    setResult(duration.years(), duration.months(), duration.days())
  }
  const validateYear = y => {
    const parsedY = parseInt(y)
    if (!y || (parsedY <= new Date().getFullYear() && parsedY >= 1)) {
      year_input.classList.remove("err")
      return true
    }
    year_input.classList.add("err")
    year_input.getElementsByTagName("span")[0].innerText = "Must be in the past"
    return false
  }
  const validateMonth = m => {
    const parsedM = parseInt(m)
    if (!m || (parsedM <= 12 && parsedM >= 1)) {
      month_input.classList.remove("err")
      return true
    }
    month_input.classList.add("err")
    month_input.getElementsByTagName("span")[0].innerText =
      "Must be a valid month"
    return false
  }
  const validateDay = (d, m, y) => {
    const parsedD = parseInt(d)
    const parsedM = parseInt(m)
    const parsedY = parseInt(y)
    if (!d || !m || isDayValid(parsedD, parsedM, parsedY)) {
      day_input.classList.remove("err")
      return true
    }
    day_input.classList.add("err")
    day_input.getElementsByTagName("span")[0].innerText = "Must be a valid day"
    return false
  }

  const validateInputs = (d, m, y) => {
    const isYearValidated = validateYear(y)
    const isMonthValidated = validateMonth(m)
    const isDayValidated = validateDay(d, m, y)
    buttonEnabled = isYearValidated && isMonthValidated && isDayValidated
  }

  if (localStorage.getItem("bday")) {
    const { d, m, y } = JSON.parse(localStorage.getItem("bday"))
    day_input.getElementsByTagName("input")[0].setAttribute("value", d)
    month_input.getElementsByTagName("input")[0].setAttribute("value", m)
    year_input.getElementsByTagName("input")[0].setAttribute("value", y)
    validateInputs(d, m, y)
  }

  const onInputChange = () => {
    const { d, m, y } = fetchValues()
    localStorage.setItem("bday", JSON.stringify({ y, m, d }))
    validateInputs(d, m, y)
  }

  year_input
    .getElementsByTagName("input")[0]
    .addEventListener("keyup", onInputChange)

  month_input
    .getElementsByTagName("input")[0]
    .addEventListener("keyup", onInputChange)

  day_input
    .getElementsByTagName("input")[0]
    .addEventListener("keyup", onInputChange)

  button.addEventListener("click", onButtonClick)
}
