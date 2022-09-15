function graph(time_dates, week_gross) {
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: time_dates,
      datasets: [
        {
          label: "Box Office",
          data: week_gross,
          order: 2,
          backgroundColor: ["#FE7E6D"],
          borderColor: ["#FE7E6D"],
          pointStyle: "circle",
          tension: 0.3,
          yAxisID: "y",
        },
        {
          label: "Releases",
          data: releases,
          type: "line",
          order: 1,
          backgroundColor: ["#d9d3e8"],
          borderColor: ["#d9d3e8"],
          pointStyle: "circle",
          tension: 0.3,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
          offset: true,
        },
        y: {
          beginAtZero: true,
          ticks: {
            autoSkip: true,
            stepSize: 100000000,
            callback: function (value, index, values) {
              var ranges = [
                { divider: 1e6, suffix: "M" },
                { divider: 1e3, suffix: "k" },
              ];
              function formatNumber(n) {
                for (var i = 0; i < ranges.length; i++) {
                  if (n >= ranges[i].divider) {
                    return (
                      (n / ranges[i].divider).toString() + ranges[i].suffix
                    );
                  }
                }
                return n;
              }
              return "£" + formatNumber(value);
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      },
    },
  });
}

function exportToCSV(tableEle, separator = ",") {
  const head = ["Year", "Box Office", "Change", "Releases"];
  let csvRows = [head];
  //only get direct children of the table in question (thead, tbody)
  Array.from(tableEle.children).forEach(function (node) {
    //using scope to only get direct tr of node
    node.querySelectorAll(":scope > tr").forEach(function (tr) {
      let csvLine = [];
      //again scope to only get direct children
      tr.querySelectorAll(":scope > td").forEach(function (td) {
        //clone as to not remove anything from original
        let copytd = td.cloneNode(true);
        let data = copytd.textContent;

        data = data.replace(/(\s\s)/gm, " ").replace(/"/g, '""');
        csvLine.push('"' + data + '"');
      });
      csvRows.push(csvLine.join(separator));
    });
  });
  var a = document.createElement("a");
  a.style = "display: none; visibility: hidden"; //safari needs visibility hidden
  a.href =
    "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join("\n"));
  a.download = "box_office.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

graph(time_dates, week_gross);