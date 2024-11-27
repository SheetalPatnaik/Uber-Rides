# monitor_performance.py
import psutil
import time
import csv

def monitor_resources():
    with open('performance_metrics.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Timestamp', 'CPU%', 'Memory%', 'Disk IO Read', 'Disk IO Write'])
        
        while True:
            cpu_percent = psutil.cpu_percent()
            memory_percent = psutil.virtual_memory().percent
            disk_io = psutil.disk_io_counters()
            
            writer.writerow([
                time.time(),
                cpu_percent,
                memory_percent,
                disk_io.read_bytes,
                disk_io.write_bytes
            ])
            time.sleep(1)

if __name__ == "__main__":
    monitor_resources()