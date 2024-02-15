import { describe, expect, it, vi } from 'vitest';
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder
} from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';

vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');
vi.mock('../src/libs/email', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn()
  };
});

describe('sendText', () => {
  it('should send a text message', () => {
    const sendText = vi.fn();
    sendText.mockImplementation(() => 'ok');

    const result = sendText('hello');

    expect(sendText).toHaveBeenCalledOnce();
    expect(sendText).toHaveBeenCalledWith('hello');
    expect(result).toBe('ok');
  });
});

describe('getPriceInCurrency', () => {
  it('should get the correct price in the given currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(2);

    const price = getPriceInCurrency(100, 'AUD');

    expect(getExchangeRate).toHaveBeenCalledWith('USD', 'AUD');
    expect(price).toBe(200);
  });
});

describe('getShippingInfo', () => {
  it('should return the shipping cost and estimated days of delivery', () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 100,
      estimatedDays: 7
    });

    const quote = getShippingInfo('sweden');

    expect(getShippingQuote).toHaveBeenCalledWith('sweden');
    expect(quote).toMatch(/shipping\scost:\s\$100\s\(7 days\)/i);
  });
  it('should return an error if no quote is found', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const quote = getShippingInfo('laos');

    expect(getShippingQuote).toHaveBeenCalledWith('laos');
    expect(quote).toMatch(/shipping\sunavailable/i);
  });
});

describe('renderPage', () => {
  vi.mocked(trackPageView).mockReturnValue(null);

  it('should return the content to render a page', async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });
  it('should call the function analytics with the page route', async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

describe('submitOrder', () => {
  const order = {
    totalAmount: 999.49
  };
  const creditCard = { creditCardNumber: '1245 5847 5822 1447' };

  it('should return an error if the payment failed', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({
      success: false,
      error: 'payment_error'
    });
  });
  it('should return success when the payment goes through', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });

    const result = await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
    expect(result).toEqual({
      success: true
    });
  });
});

describe('signUp', () => {
  const validEmail = 'name@domain.com';
  const invalidEmail = 'email';

  it('should return false if email is not valid', async () => {
    const result = await signUp(invalidEmail);

    expect(result).toBe(false);
  });
  it('should return true if email is valid', async () => {
    const result = await signUp(validEmail);

    expect(result).toBe(true);
  });
  it('should send a welcome email if email is valid', async () => {
    const result = await signUp(validEmail);

    const [email, message] = vi.mocked(sendEmail).mock.calls[0];

    expect(sendEmail).toHaveBeenCalled();
    expect(email).toBe(validEmail);
    expect(message).toMatch(/welcome/i);
    expect(result).toBe(true);
  });
});

describe('login', () => {
  const validEmail = 'name@domain.com';

  it('should email the one-time login code', async () => {
    const spy = vi.spyOn(security, 'generateCode');

    await login(validEmail);

    const { value } = spy.mock.results[0];
    const securityCode = value.toString();

    expect(sendEmail).toHaveBeenCalledOnce();
    expect(sendEmail).toHaveBeenCalledWith(validEmail, securityCode);
  });
});

describe('isOnline', () => {
  it('should return false if the current hour is outside opening hours', async () => {
    vi.setSystemTime('2024-01-01 07:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-01-01 20:01');
    expect(isOnline()).toBe(false);
  });

  it('should return true if the current hour is within opening hours', async () => {
    vi.setSystemTime('2024-01-01 08:00');
    expect(isOnline()).toBe(true);

    vi.setSystemTime('2024-01-01 19:59');
    expect(isOnline()).toBe(true);
  });
});

describe('getDiscount', () => {
  it('should return a discount of 20% on xmas', async () => {
    vi.setSystemTime('2024-12-25 00:00');
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime('2024-12-25 23:59');
    expect(getDiscount()).toBe(0.2);
  });

  it('should return no discount for any other day', async () => {
    vi.setSystemTime('2024-12-26 00:00');
    expect(getDiscount()).toBe(0);
  });
});
