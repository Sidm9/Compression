import sharp from 'sharp';
import os from 'os';

const totalTimeTaken: number[] = [];
const CPUDifference: number[] = [];
const MemoryDifference: number[] = [];

const NUMBER_OF_RUNS = 150;

const path = "../Image/23_08_22_18_23_step02_CAM022.png";

const log_cpu_memory_time = (func: Function) => {
    return async () => {
        const start_time = Date.now();
        
        const memory_before = os.freemem() / os.totalmem() * 100;
        
        const cpu_before = await cpuUsage();
        
        await func();
        
        const cpu_after = await cpuUsage();
        
        const memory_after = os.freemem() / os.totalmem() * 100;
        
        const end_time = Date.now();
        const execution_time = (end_time - start_time) / 1000;
        
        totalTimeTaken.push(execution_time);
        
        if (cpu_after > cpu_before) {
            CPUDifference.push(cpu_after - cpu_before);
        }
        
        if (memory_after > memory_before) {
            MemoryDifference.push(memory_after - memory_before);
        }
    };
}

async function cpuUsage() {
    return new Promise<number>((resolve) => {
        setTimeout(async () => {
            const startUsage = process.cpuUsage();
            await new Promise((r) => setTimeout(r, 100));
            const endUsage = process.cpuUsage(startUsage);
            const userUsage = endUsage.user / 1000;
            const systemUsage = endUsage.system / 1000;
            const totalUsage = userUsage + systemUsage;
            resolve(totalUsage);
        });
    });
}

const CompressAndSaveImage = log_cpu_memory_time(async () => {
      await sharp(path).jpeg({ quality: 100 }).toFile('../Output/Pillow/CompressedSharp.jpg');
      console.log('Done');
});

(async () => {
    for (let i = 0; i < NUMBER_OF_RUNS; i++) {
        await CompressAndSaveImage();
    }

    console.log("\n\n");
    console.log("Total Time: ", totalTimeTaken);
    console.log("\n\n");
    const averageTotalTime = totalTimeTaken.reduce((a, b) => a + b, 0) / totalTimeTaken.length;
    console.log("Average Sum Time: ", averageTotalTime.toFixed(3),"s");

    console.log("\n\n");
    console.log("Total CPU: ", CPUDifference);
    const averageCPUTime = CPUDifference.reduce((a, b) => a + b, 0) / CPUDifference.length;
    console.log("Average CPU Time: ", averageCPUTime.toFixed(3)+"%");

    console.log("\n\n");
    console.log("Memory:", MemoryDifference);
    const averageMemory = MemoryDifference.reduce((a, b) => a + b, 0) / MemoryDifference.length;
    console.log("Averge Memory", averageMemory.toFixed(3),"%");
})();
