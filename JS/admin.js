    let visitCounts = {}; // 存储过去一周每天的访问量数据，以日期为键
        let chartInstance; // 用于存储Chart.js图表实例
        function getIP(json) {
            document.write("My public IP address is: ", json.ip);
        }
        function getQueryParams() {
            const params = new URLSearchParams(window.location.search);
            const pv = parseInt(params.get('pv')) || 0; // 如果没有pv参数，默认为0
            return {
                pv: pv
            };
        }

        function checkPassword() {
            const password = document.getElementById('admin-password').value;
            const adminContent = document.getElementById('admin-content');
            const container = document.querySelector('.container');

            if (password === "666666") {
                container.innerHTML = '';
                container.appendChild(adminContent);
                adminContent.style.display = "block";
                
                // 获取并显示正确的访问量
                updateVisitCounts();
                
                startClock();
                drawChart();
                addImportExportButtons();
            } else {
                alert("密码错误，请重试。");
            }
        }

        function startClock() {
            setInterval(() => {
                const now = new Date();
                document.getElementById('current-time').textContent = now.toLocaleString();
            }, 1000); // 每秒更新
        }

        function drawChart() {
            const labels = [];
            const data = [];
            const today = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateKey = formatDate(date);
                labels.unshift(date.toLocaleDateString());
                data.unshift(visitCounts[dateKey] || 0);
            }

            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(document.getElementById('visit-chart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '访问量',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        function toggleVisitLog() {
            const visitLog = document.getElementById('visit-log');
            const chartContainer = document.getElementById('chart-container');
            if (visitLog.style.display === 'none') {
                visitLog.style.display = 'block'; // 显示表格
                chartContainer.style.display = 'none'; // 隐藏图表
                createVisitLogTable(); // 创建表格
            } else {
                visitLog.style.display = 'none'; // 隐藏表格
                chartContainer.style.display = 'block'; // 显示图表
            }
        }

        function createVisitLogTable() {
            const visitLog = document.getElementById('visit-log');
            visitLog.innerHTML = '';
            const table = document.createElement('table');
            table.style.width = '100%';
            table.innerHTML = `
                <tr>
                    <th>日期</th>
                    <th>访问量</th>
                </tr>
            `;
            
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateKey = formatDate(date);
                const visitCount = visitCounts[dateKey] || 0;
                const row = table.insertRow();
                row.innerHTML = `
                    <td>${date.toLocaleDateString()}</td>
                    <td>${visitCount}</td>
                `;
            }
            visitLog.appendChild(table);
        }

        function getVisitData() {
            const storedData = localStorage.getItem('visitData');
            return storedData ? JSON.parse(storedData) : {};
        }

        function saveVisitData(data) {
            localStorage.setItem('visitData', JSON.stringify(data));
        }

        function updateVisitCounts() {
            const params = getQueryParams();
            const totalVisits = params.pv;  // 从URL获取总访问量
            
            // 获取存储的访问���据
            visitCounts = getVisitData();
            
            const today = new Date();
            const todayKey = formatDate(today);
            
            // 计算之前几天的总访问量
            let previousDaysTotal = 0;
            for (let i = 1; i <= 6; i++) {
                const prevDate = new Date(today);
                prevDate.setDate(today.getDate() - i);
                const dateKey = formatDate(prevDate);
                previousDaysTotal += (visitCounts[dateKey] || 0);
            }
            
            // 如果有URL参数传入总访问量
            if (totalVisits > 0) {
                // 计算今天的访问量 = 总访问量 - 之前几天的访问量总和
                visitCounts[todayKey] = Math.max(0, totalVisits - previousDaysTotal);
                saveVisitData(visitCounts);
                // 显示传入的总访问量
                document.getElementById('visit-count').textContent = totalVisits;
            } else {
                // 如果没有传入参数，显示存储数据的总和
                let storedTotal = previousDaysTotal + (visitCounts[todayKey] || 0);
                document.getElementById('visit-count').textContent = storedTotal;
            }
            
            // 清理超过7天的旧数据
            cleanOldData();
        }

        function formatDate(date) {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }

        function cleanOldData() {
            const today = new Date();
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            
            // 删除7天以前的数据
            Object.keys(visitCounts).forEach(dateKey => {
                const keyDate = new Date(dateKey);
                if (keyDate < sevenDaysAgo) {
                    delete visitCounts[dateKey];
                }
            });
        }

        function saveDailyData() {
            // 直接保存到 localStorage
            saveVisitData(visitCounts);
        }

        window.onload = function() {
            updateVisitCounts(); // 更新访问量数据
            drawChart(); // 绘制图表
            startClock(); // 启动实时更新的时钟
        };

        // 每天结束时保存数据，这里我们使用一个简单的定时器来模拟
        setInterval(() => {
            const now = new Date();
            if (now.getHours() === 23 && now.getMinutes() === 59 && now.getSeconds() === 59) {
                saveDailyData(); // 调用保存数据的函数
            }
        }, 1000);

        function downloadData() {
            // 构建 CSV 内容
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "日期,访问量\r\n"; // CSV 头部

            const today = new Date();
            const labels = [];
            const data = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
                labels.unshift(date.toLocaleDateString());
                data.unshift(visitCounts[date.getDate()] || 0);
                // 添加 CSV 行内容
                csvContent += `${date.toISOString().split('T')[0]},${visitCounts[date.getDate()] || 0}\r\n`;
            }

            // 数据编码为 URI
            const encodedUri = encodeURI(csvContent);

            // 创建一个链接元素用于下载
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "visit-counts.csv"); // 设置下载文件名
            document.body.appendChild(link); // 将链接添加到文档中

            // 触发下载
            link.click();

            // 清理
            document.body.removeChild(link); // 下载后移除链接
        }

        function addImportExportButtons() {
            const adminContent = document.getElementById('admin-content');
            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '20px';
            buttonContainer.innerHTML = `
                <button onclick="exportData()">导出数据</button>
                <input type="file" id="importFile" style="display: none;" onchange="importData(event)">
                <button onclick="document.getElementById('importFile').click()">导入数据</button>
            `;
            adminContent.appendChild(buttonContainer);
        }

        function exportData() {
            const data = {
                visitCounts: visitCounts,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'visit-data.json';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        function importData(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.visitCounts) {
                        const params = getQueryParams();
                        const totalVisits = params.pv;
                        
                        // 清空当前的访问数据
                        visitCounts = {};
                        
                        // 首先导入历史数据
                        Object.keys(data.visitCounts).forEach(dateKey => {
                            visitCounts[dateKey] = data.visitCounts[dateKey];
                        });
                        
                        const today = new Date();
                        const todayKey = formatDate(today);
                        
                        if (totalVisits > 0) {
                            // 如果有URL参数，重新计算今天的访问量
                            let previousDaysTotal = 0;
                            for (let i = 1; i <= 6; i++) {
                                const prevDate = new Date(today);
                                prevDate.setDate(today.getDate() - i);
                                const dateKey = formatDate(prevDate);
                                previousDaysTotal += (visitCounts[dateKey] || 0);
                            }
                            
                            // 更新今天的访问量
                            visitCounts[todayKey] = Math.max(0, totalVisits - previousDaysTotal);
                        }
                        
                        // 保存数据到localStorage
                        saveVisitData(visitCounts);
                        
                        // 更新显示
                        updateVisitCounts();
                        drawChart();
                        createVisitLogTable();
                        
                        alert('数据导入成功！');
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    alert('数据导入失败：无效的文件格式');
                }
            };
            reader.readAsText(file);
        }