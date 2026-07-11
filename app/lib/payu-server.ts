import { createHash, timingSafeEqual } from "crypto";

export type PayuCheckoutFields = Record<string, string>;

export type PayuConfig = {
  apiKey: string;
  merchantId: string;
  accountId: string;
  currency: string;
  test: boolean;
  checkoutUrl: string;
};

const CHECKOUT_URLS = {
  test: "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/",
  production: "https://checkout.payulatam.com/ppp-web-gateway-payu/",
} as const;

function boolFromEnv(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value.trim() === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function getPayuConfig(): PayuConfig {
  const apiKey = process.env.PAYU_API_KEY;
  const merchantId = process.env.PAYU_MERCHANT_ID;
  const accountId = process.env.PAYU_ACCOUNT_ID;
  const currency = process.env.PAYU_CURRENCY || "COP";
  const test = boolFromEnv(process.env.PAYU_TEST, true);

  if (!apiKey || !merchantId || !accountId) {
    throw new Error(
      "Faltan PAYU_API_KEY, PAYU_MERCHANT_ID o PAYU_ACCOUNT_ID",
    );
  }

  return {
    apiKey,
    merchantId,
    accountId,
    currency,
    test,
    checkoutUrl: test ? CHECKOUT_URLS.test : CHECKOUT_URLS.production,
  };
}

export function sanitizePayuReference(value: string): string {
  const clean = value.replace(/[^A-Za-z0-9]/g, "");
  return clean || `PHPLUS${Date.now()}`;
}

export function formatPayuAmount(amount: number): string {
  return amount.toFixed(2);
}

function md5(value: string): string {
  return createHash("md5").update(value).digest("hex");
}

export function createPayuCheckoutSignature({
  apiKey,
  merchantId,
  referenceCode,
  amount,
  currency,
}: {
  apiKey: string;
  merchantId: string;
  referenceCode: string;
  amount: string;
  currency: string;
}): string {
  return md5(`${apiKey}~${merchantId}~${referenceCode}~${amount}~${currency}`);
}

export function formatPayuConfirmationValue(value: string): string {
  const [integer, decimals] = value.split(".");
  if (!decimals) return `${integer}.0`;
  if (decimals.length > 1 && decimals[1] !== "0") {
    return `${integer}.${decimals.slice(0, 2)}`;
  }
  return `${integer}.${decimals[0] ?? "0"}`;
}

export function createPayuConfirmationSignature({
  apiKey,
  merchantId,
  referenceSale,
  value,
  currency,
  statePol,
}: {
  apiKey: string;
  merchantId: string;
  referenceSale: string;
  value: string;
  currency: string;
  statePol: string;
}): string {
  return md5(
    `${apiKey}~${merchantId}~${referenceSale}~${formatPayuConfirmationValue(
      value,
    )}~${currency}~${statePol}`,
  );
}

export function verifySignature(received: string, calculated: string): boolean {
  const a = Buffer.from(received.toLowerCase());
  const b = Buffer.from(calculated.toLowerCase());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getRequestOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured && !configured.includes("localhost")) {
    return configured.replace(/\/$/, "");
  }

  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (host) return `${proto}://${host}`;

  return new URL(request.url).origin;
}
