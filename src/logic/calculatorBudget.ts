import materials from '../data/materials.json';

interface MaterialInfo {
    amountPerM2: number;
    pricePerUnit: number;
}

interface MaterialSummary {
    name: string;
    amount: number;
    totalPrice: number;
}

export function calculateMaterials(workTypes: string[], area: number): MaterialSummary[] {
    const accumulated: Record<string, MaterialSummary> = {};

    for (const type of workTypes) {
        const workMaterials = (materials as Record<string, Record<string, MaterialInfo>>)[type];
        if (!workMaterials) continue;

        for (const [name, { amountPerM2, pricePerUnit }] of Object.entries(workMaterials)) {
            const amount = +(amountPerM2 * area).toFixed(2);
            const totalPrice = +(amount * pricePerUnit).toFixed(2);

            if (!accumulated[name]) {
                accumulated[name] = { name, amount: 0, totalPrice: 0 };
            }

            accumulated[name].amount += amount;
            accumulated[name].totalPrice += totalPrice;
        }
    }

    return Object.values(accumulated);
}
