import psutil
import time
from PIL import Image
import functools

path = "../Image/23_08_22_18_23_step02_CAM022.png"

totalTimeTaken = []
CPUDifference = []
MemoryDifference = []

NUMBER_OF_RUNS = 1

def log_cpu_memory_time(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        # Get memory usage before function execution
        memory_before = psutil.virtual_memory().percent
        
        # Get CPU usage before function execution
        cpu_before = psutil.cpu_percent()
        
        result = func(*args, **kwargs)
        
        # Get CPU usage after function execution
        cpu_after = psutil.cpu_percent()
        
        # Get memory usage after function execution
        memory_after = psutil.virtual_memory().percent
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        print(f"Function '{func.__name__}' executed in {execution_time:.6f} seconds.")
        totalTimeTaken.append(execution_time)

        print(f"CPU usage before: {cpu_before:.2f}% | CPU usage after: {cpu_after:.2f}%")
        if (cpu_after > cpu_before):
          CPUDifference.append(cpu_after - cpu_before)

        print(f"Memory usage before: {memory_before:.2f}% | Memory usage after: {memory_after:.2f}%")
        if (memory_after > memory_before):
          MemoryDifference.append(memory_after - memory_before)
        
        return result
    return wrapper 


@log_cpu_memory_time
def CompressAndSaveImage(path):
  img = Image.open(path)
  img.save('../Output/Pillow/Compressed.png' , quality=100 , format='PNG')
  print("Done")

for i in range(0, NUMBER_OF_RUNS):
  CompressAndSaveImage(path)


print("\n\n")
print("Total Time: " ,totalTimeTaken)
print("\n\n")
averageTotalTime = sum(totalTimeTaken) / len(totalTimeTaken)
print("Average Sum Time: " , round(averageTotalTime, 3),"s")

print("\n\n")
print("Total CPU: " ,CPUDifference)
if len(CPUDifference) != 0:
  averageCPUTime = sum(CPUDifference) / len(CPUDifference)
  print("Average CPU Time: " , round(averageCPUTime,3),"%")

print("\n\n")

print("Memory:" ,MemoryDifference)
if len(MemoryDifference) != 0:
  averageMemory = sum(MemoryDifference) / len(MemoryDifference)
  print("Averge Memory" , round(averageMemory,3),"%")