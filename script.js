document.getElementById('bp-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const systolic = document.getElementById('systolic').value;
    const diastolic = document.getElementById('diastolic').value;
    
    const recordList = document.getElementById('record-list');
    const listItem = document.createElement('li');
    listItem.textContent = `收縮壓: ${systolic} mm Hg, 舒張壓: ${diastolic} mm Hg`;
    
    // Add blood pressure category
    let category = '';
    if (systolic < 120 && diastolic < 80) {
        category = '正常血壓';
    } else if (systolic >= 120 && systolic <= 139 || diastolic >= 80 && diastolic <= 89) {
        category = '高血壓前期';
    } else if (systolic >= 140 && systolic <= 159 || diastolic >= 90 && diastolic <= 99) {
        category = '高血壓第1期';
    } else if (systolic >= 160 && systolic <= 179 || diastolic >= 100 && diastolic <= 109) {
        category = '高血壓第2期';
    }
    listItem.textContent += ` - ${category}`;
    
    recordList.appendChild(listItem);
    
    document.getElementById('bp-form').reset();
});