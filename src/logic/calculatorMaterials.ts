import materialsData from '../data/materials.json';
import priceData from '../data/price.json';

interface Material {
    amountPerM2: number;
    pricePerUnit: number;
}

interface MaterialsData {
    [key: string]: {
        [material: string]: Material;
    };
}

interface PriceData {
    equipment: {
        [key: string]: { pricePerDay: number };
    };
    workers: {
        [key: string]: { pricePerDay: number };
    };
}

const materialsDataTyped: MaterialsData = materialsData;
const priceDataTyped: PriceData = priceData;

// Функція для обчислення вартості матеріалів
const calculateMaterialsCost = (workType: string, area: number): number => {
    const workMaterials = materialsDataTyped[workType];
    let totalCost = 0;

    if (!workMaterials) {
        throw new Error(`Тип робіт '${workType}' не знайдено.`);
    }

    for (const material in workMaterials) {
        const materialData = workMaterials[material];
        totalCost += materialData.amountPerM2 * area * materialData.pricePerUnit;
    }

    return totalCost;
};

// Функція для обчислення вартості обладнання
const calculateEquipmentCost = (equipment: string[], days: number): number => {
    let totalCost = 0;

    equipment.forEach(item => {
        const equipmentData = priceDataTyped.equipment[item];
        if (equipmentData) {
            totalCost += equipmentData.pricePerDay * days;
        } else {
            console.warn(`Обладнання '${item}' не знайдено.`);
        }
    });

    return totalCost;
};

// Функція для обчислення вартості робітників
const calculateWorkersCost = (workers: string[], days: number): number => {
    let totalCost = 0;

    workers.forEach(worker => {
        const workerData = priceDataTyped.workers[worker];
        if (workerData) {
            totalCost += workerData.pricePerDay * days;
        } else {
            console.warn(`Робітник '${worker}' не знайдено.`);
        }
    });

    return totalCost;
};

// Основна функція для розрахунку загальної вартості проекту
const calculateTotalCost = (
    workType: string, 
    area: number, 
    equipment: string[], 
    workers: string[], 
    days: number
): number => {
    const materialsCost = calculateMaterialsCost(workType, area);
    const equipmentCost = calculateEquipmentCost(equipment, days);
    const workersCost = calculateWorkersCost(workers, days);

    return materialsCost + equipmentCost + workersCost;
};

export {
    calculateMaterialsCost,
    calculateEquipmentCost,
    calculateWorkersCost,
    calculateTotalCost
};
