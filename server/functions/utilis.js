
exports.getExactdate = (date) => {
    const exactdate = date.split("T")[0];
    const [year, month, day] = exactdate.split("-");
    const formdata = `${day}-${month}-${year}`;
    return formdata;
  };
  