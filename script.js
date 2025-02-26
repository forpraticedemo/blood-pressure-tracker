// Blood Pressure Tracker Script

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bpForm = document.getElementById('bp-form');
    const systolicInput = document.getElementById('systolic');
    const diastolicInput = document.getElementById('diastolic');
    const heartRateInput = document.getElementById('heartRate');
    const bpDataTable = document.getElementById('bp-data');
    const refreshButton = document.getElementById('refresh-data');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error-message');
    
    // Hide loading indicator initially
    loadingElement.style.display = 'none';
    
    // Fetch data on page load
    fetchBloodPressureData();
    
    // Event Listeners
    bpForm.addEventListener('submit', handleFormSubmit);
    refreshButton.addEventListener('click', fetchBloodPressureData);
    
    /**
     * Handle form submission
     */
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        const data = {
            收縮壓: Number(systolicInput.value),
            舒張壓: Number(diastolicInput.value),
            心率: Number(heartRateInput.value),
            時間: Date.now()
        };
        
        try {
            errorElement.textContent = '';
            const submitButton = bpForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = '儲存中...';
            
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('伺服器回應錯誤');
            }
            
            // Reset form
            bpForm.reset();
            
            // Refresh data
            fetchBloodPressureData();
            
            // Show success indicator
            submitButton.textContent = '儲存成功!';
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = '儲存';
            }, 2000);
            
        } catch (error) {
            console.error('Error submitting data:', error);
            errorElement.textContent = `錯誤: ${error.message}`;
            
            const submitButton = bpForm.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = '儲存';
        }
    }
    
    /**
     * Fetch blood pressure data from the API
     */
    async function fetchBloodPressureData() {
        try {
            // Show loading indicator
            loadingElement.style.display = 'block';
            errorElement.textContent = '';
            bpDataTable.innerHTML = '';
            
            const response = await fetch(`${WEB_APP_URL}?sheetId=${SHEET_ID}&sheetName=${SHEET_NAME}`);
            
            if (!response.ok) {
                throw new Error('獲取資料失敗');
            }
            
            const result = await response.json();
            
            if (result.status === 200 && result.data) {
                displayBloodPressureData(result.data);
            } else {
                throw new Error(result.message || '資料格式錯誤');
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
            errorElement.textContent = `錯誤: ${error.message}`;
        } finally {
            // Hide loading indicator
            loadingElement.style.display = 'none';
        }
    }
    
    /**
     * Display blood pressure data in the table
     */
    function displayBloodPressureData(data) {
        if (!data || data.length === 0) {
            bpDataTable.innerHTML = '<tr><td colspan="4" class="no-data">尚無資料</td></tr>';
            return;
        }
        
        // Clear the table
        bpDataTable.innerHTML = '';
        
        // Sort data by time, newest first
        data.sort((a, b) => b.時間 - a.時間);
        
        // Loop through data and create table rows
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Create the cells
            const systolicCell = document.createElement('td');
            systolicCell.textContent = item.收縮壓;
            row.appendChild(systolicCell);
            
            const diastolicCell = document.createElement('td');
            diastolicCell.textContent = item.舒張壓;
            row.appendChild(diastolicCell);
            
            const heartRateCell = document.createElement('td');
            heartRateCell.textContent = item.心率;
            row.appendChild(heartRateCell);
            
            const timeCell = document.createElement('td');
            timeCell.textContent = formatTimestamp(item.時間);
            row.appendChild(timeCell);
            
            // Add color coding based on blood pressure values
            colorCodeRow(row, item.收縮壓, item.舒張壓);
            
            // Add the row to the table
            bpDataTable.appendChild(row);
        });
    }
    
    /**
     * Format timestamp into readable date and time
     */
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-TW', { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    /**
     * Color code the table row based on blood pressure values
     */
    function colorCodeRow(row, systolic, diastolic) {
        // Blood pressure categories (based on American Heart Association guidelines)
        if (systolic >= 180 || diastolic >= 120) {
            // Hypertensive Crisis
            row.classList.add('bp-crisis');
            row.title = '高血壓危機';
        } else if (systolic >= 140 || diastolic >= 90) {
            // High Blood Pressure (Stage 2)
            row.classList.add('bp-high-2');
            row.title = '第二階段高血壓';
        } else if (systolic >= 130 || diastolic >= 80) {
            // High Blood Pressure (Stage 1)
            row.classList.add('bp-high-1');
            row.title = '第一階段高血壓';
        } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
            // Elevated
            row.classList.add('bp-elevated');
            row.title = '血壓偏高';
        } else if (systolic < 120 && diastolic < 80) {
            // Normal
            row.classList.add('bp-normal');
            row.title = '正常血壓';
        } else {
            // Other cases
            row.classList.add('bp-other');
        }
    }
});