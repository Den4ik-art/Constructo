import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import "./scss/reset.scss";
import "./scss/main.scss";
import "./scss/header.scss";
import "./scss/content.scss";
import "./scss/footer.scss";
import { calculateTotalCost } from './logic/calculatorMaterials.ts';
import { calculateMaterials } from './logic/calculatorBudget.ts';

// Оголошуємо елементи
const resultElement = document.querySelector('.result') as HTMLElement;
const orderButton = document.querySelector('.result__order-button') as HTMLButtonElement;
const materialsList = document.querySelector('.result__materials') as HTMLUListElement;
const totalCostElement = document.querySelector('.result__total') as HTMLElement;

// Обробник кнопки
orderButton?.addEventListener('click', () => {
  alert('Замовлення оформлено!');
});

// Перевірка валідності
function areAllFieldsValid(): boolean {
  const areaInput = document.querySelector<HTMLInputElement>('input[placeholder*="Площа"]');
  const startDateInput = document.querySelector<HTMLInputElement>('input#start-date');
  const endDateInput = document.querySelector<HTMLInputElement>('input#end-date');
  const workInputs = document.querySelectorAll<HTMLInputElement>('input[name="work"]:checked');
  const equipmentInputs = document.querySelectorAll<HTMLInputElement>('.section4__equipment input[type="checkbox"]:checked');
  const workerInputs = document.querySelectorAll<HTMLInputElement>('input[name="worker"]:checked');

  return  areaInput?.value.trim() !== '' &&
          startDateInput?.value.trim() !== '' &&
          endDateInput?.value.trim() !== '' &&
          workInputs.length > 0 &&
          equipmentInputs.length > 0 &&
          workerInputs.length > 0;
}

// Оновлення розрахунку
function updateCalculation() {
  try {
    const areaInput = document.querySelector<HTMLInputElement>('input[placeholder*="Площа"]');
    const startDateInput = document.querySelector<HTMLInputElement>('input#start-date');
    const endDateInput = document.querySelector<HTMLInputElement>('input#end-date');
    const workInputs = document.querySelectorAll<HTMLInputElement>('input[name="work"]:checked');
    const equipmentInputs = document.querySelectorAll<HTMLInputElement>('.section4__equipment input[type="checkbox"]:checked');
    const workerInputs = document.querySelectorAll<HTMLInputElement>('input[name="worker"]:checked');

    const area = parseFloat(areaInput?.value || '0');
    const workTypes = Array.from(workInputs).map(w => w.value);
    const start = new Date(startDateInput?.value || '');
    const end = new Date(endDateInput?.value || '');
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const equipment = Array.from(equipmentInputs).map(e => e.value);
    const workers = Array.from(workerInputs).map(w => w.value);

    const total = workTypes.reduce((sum, workType) => {
      return sum + calculateTotalCost(workType, area, equipment, workers, days);
    }, 0);

    const materials = calculateMaterials(workTypes, area);

    if (materialsList && totalCostElement) {
      materialsList.innerHTML = materials.map(m =>
        `<li>${m.name}: ${m.amount} од. × ${(m.totalPrice / m.amount).toFixed(2)} грн = ${m.totalPrice.toFixed(2)} грн</li>`
      ).join('');

      totalCostElement.textContent = `Загальна вартість: ${total.toFixed(2)} грн`;
    }

    console.log('Матеріали:', materials);
    console.log('Загальна вартість:', total);

    if (areAllFieldsValid()) {
      resultElement.classList.remove('hidden');
    } else {
      resultElement.classList.add('hidden');
    }

  } catch (error) {
    console.error('Помилка розрахунку:', error);
  }
}

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', updateCalculation);
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
