document.addEventListener('DOMContentLoaded', function() {
  fetchData();

  document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addData();
  });
});

function fetchData() {
  fetch(YOUR_WEB_APP_URL, { mode: 'no-cors' })
    .then(response => response.json())
    .then(data => {
      var dataDiv = document.getElementById('data');
      dataDiv.innerHTML = '';
      data.forEach(item => {
        dataDiv.innerHTML += `<p>收縮壓: ${item.收縮壓}, 舒張壓: ${item.舒張壓}, 心率: ${item.心率}, 時間: ${item.時間}</p>`;
      });
    });
}

function addData() {
  var systolic = document.getElementById('systolic').value;
  var diastolic = document.getElementById('diastolic').value;
  var heartRate = document.getElementById('heartRate').value;
  var timestamp = document.getElementById('timestamp').value;

  fetch(YOUR_WEB_APP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      收縮壓: systolic,
      舒張壓: diastolic,
      心率: heartRate,
      時間: timestamp
    }),
    mode: 'no-cors'
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      fetchData();
    }
  });
}