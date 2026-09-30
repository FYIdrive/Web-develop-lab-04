import { useState } from "react";
import "./DiscountCalculator.css";

// Ставка НДС в долях (22%)
const VAT_RATE = 0.22;

function DiscountCalculator() {
  // --- Состояние ---
  // Исходная цена, введённая пользователем (строка — для controlled input)
  const [price, setPrice] = useState("");
  // Ручная скидка в процентах
  const [discountPercent, setDiscountPercent] = useState(0);
  // Введённый промокод
  const [promoCode, setPromoCode] = useState("");
  // Признак того, что пользователь нажал «Рассчитать»
  // До первого нажатия результаты не показываем
  const [calculated, setCalculated] = useState(false);
  // Сообщение об ошибке валидации цены
  const [error, setError] = useState("");
  // --- Обработчики событий ---
  // Изменение цены: разрешаем только цифры и точку
  function handlePriceChange(e) {
    const value = e.target.value;
    // Разрешаем пустую строку (чтобы пользователь мог стереть поле)
    // и числа с одной точкой
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setError("");         // Сбрасываем ошибку при вводе
      setCalculated(false); // Пересчёт нужен заново
    }
  }

  function handlePromoCodeChange(e) {
    setPromoCode(e.target.value);
    setCalculated(false);
  }

  function handleDiscountChange(e) {
    setDiscountPercent(Number(e.target.value));
    setCalculated(false);
  }
  // Нажатие кнопки «Рассчитать»
  function handleCalculate() {
    // Парсим цену в число
    const numPrice = parseFloat(price);
    // Валидация: пустое поле
    if (!price.trim()) {
      setError("Введите цену товара");
      setCalculated(false);
      return;
    }
    // Валидация: не число или отрицательное
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Цена должна быть положительным числом");
      setCalculated(false);
      return;
    }
    // Валидация прошла — показываем результаты
    setError("");
    setCalculated(true);
  }

  // Сброс формы
  function handleReset() {
    setPrice("");
    setDiscountPercent(0);
    setPromoCode("");
    setCalculated(false);
    setError("");
  }
  // --- Вычисления ---
  // Все вычисления проводим только если calculated === true
  // и цена корректна
  const numPrice = parseFloat(price) || 0;
  const discountAmount = calculated ? numPrice * (discountPercent / 100) : 0;
  const priceAfterDiscount = calculated ? numPrice - discountAmount : 0;
  const hasPromoCode = promoCode.trim().toUpperCase() === "WELCOME10";
  const promoDiscountAmount = calculated && hasPromoCode ? priceAfterDiscount * 0.1 : 0;
  const priceAfterAllDiscounts = priceAfterDiscount - promoDiscountAmount;
  const vatAmount = calculated ? priceAfterAllDiscounts * VAT_RATE : 0;
  const total = calculated ? priceAfterAllDiscounts + vatAmount : 0;
  // Вспомогательная функция: форматирование в рублях
  function formatRub(value) {
    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

    return (
    <div className="calculator-wrapper">
      <h2 className="calculator-title">Калькулятор скидок</h2>
      
      {/* Поле ввода цены */}
      <div className="field">
        <label htmlFor="price" className="field__label">
          Цена товара (₽)
        </label>
        <input
          id="price"
          type="text"
          className={`field__input ${error ? "field__input--error" : ""}`}
          value={price}
          onChange={handlePriceChange}
          placeholder="Например: 1000"
          inputMode="decimal"
        />
        {/* Показываем ошибку, если она есть */}
        {error && <span className="field__error">{error}</span>}
      </div>
      <div className="field">
        <label htmlFor="promoCode" className="field__label">
          Промокод
        </label>
        <input
          id="promoCode"
          type="text"
          className="field__input"
          value={promoCode}
          onChange={handlePromoCodeChange}
          placeholder="Введите промокод"
        />
      </div>

      <div className="field">
        <label htmlFor="discount" className="field__label">
          Кастомная скидка: {discountPercent}%
        </label>
        <input
          id="discount"
          type="range"
          className="field__range"
          min="0"
          max="50"
          step="1"
          value={discountPercent}
          onChange={handleDiscountChange}
          aria-valuetext={`${discountPercent}%`}
        />
      </div>
      {/* Кнопки */}
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={handleCalculate}>
          Рассчитать
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleReset}>
          Сбросить
        </button>
      </div>

{calculated && !error && (
        <div className="results">
          <h3 className="results__title">Результат расчёта</h3>
          <table className="results__table">
            <tbody>
              <tr>
                <td>Исходная цена</td>
                <td className="results__value">{formatRub(numPrice)} ₽</td>
              </tr>
              <tr>
                <td>
                  Кастомная скидка ({discountPercent}%)
                </td>
                <td className="results__value results__value--discount">
                  −{formatRub(discountAmount)} ₽
                </td>
              </tr>
              {hasPromoCode && (
                <tr>
                  <td>Промокод WELCOME10 (10%)</td>
                  <td className="results__value results__value--discount">
                    −{formatRub(promoDiscountAmount)} ₽
                  </td>
                </tr>
              )}
              <tr>
                <td>Цена после скидок</td>
                <td className="results__value">{formatRub(priceAfterAllDiscounts)} ₽</td>
              </tr>
              <tr>
                <td>НДС (22%)</td>
                <td className="results__value">+{formatRub(vatAmount)} ₽</td>
              </tr>
              <tr className="results__row--total">
                <td>Итого к оплате</td>
                <td className="results__value">{formatRub(total)} ₽</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>  );}
export default DiscountCalculator;


          