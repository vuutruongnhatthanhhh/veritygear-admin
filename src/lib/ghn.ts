// Thin wrapper around GHN's (Giao Hàng Nhanh) public API. Token/ShopId are
// passed in per-call (read from ghn_settings by the caller) rather than
// pulled from env, since they're staff-configurable from the admin UI.
//
// Docs: https://api.ghn.vn/home/docs/detail?id=<...> — field names below
// (service_type_id, payment_type_id, etc.) match GHN's documented contract
// as of this writing; re-verify against the live docs before going live,
// GHN has changed field names across API versions before.

const BASE_URL = process.env.GHN_API_URL || "https://online-gateway.ghn.vn/shiip/public-api";

type GhnAuth = { token: string; shopId?: string };

async function ghnFetch<T>(path: string, auth: GhnAuth, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Token: auth.token,
  };
  if (auth.shopId) headers.ShopId = auth.shopId;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json || json.code !== 200) {
    const message = json?.message || json?.code_message_value || `GHN request failed (${res.status})`;
    throw new Error(message);
  }

  return json.data as T;
}

export type GhnProvince = { ProvinceID: number; ProvinceName: string };
export type GhnDistrict = { DistrictID: number; DistrictName: string; ProvinceID: number };
export type GhnWard = { WardCode: string; WardName: string; DistrictID: number };

export function ghnGetProvinces(auth: GhnAuth) {
  return ghnFetch<GhnProvince[]>("/master-data/province", auth);
}

export function ghnGetDistricts(auth: GhnAuth, provinceId: number) {
  return ghnFetch<GhnDistrict[]>("/master-data/district", auth, {
    method: "POST",
    body: JSON.stringify({ province_id: provinceId }),
  });
}

export function ghnGetWards(auth: GhnAuth, districtId: number) {
  return ghnFetch<GhnWard[]>("/master-data/ward", auth, {
    method: "POST",
    body: JSON.stringify({ district_id: districtId }),
  });
}

export type GhnFeeParams = {
  serviceTypeId: number;
  toDistrictId: number;
  toWardCode: string;
  weightGrams: number;
  insuranceValue?: number;
  fromDistrictId?: number;
};

export async function ghnCalculateFee(auth: GhnAuth, params: GhnFeeParams): Promise<number> {
  const data = await ghnFetch<{ total: number }>("/v2/shipping-order/fee", auth, {
    method: "POST",
    body: JSON.stringify({
      service_type_id: params.serviceTypeId,
      to_district_id: params.toDistrictId,
      to_ward_code: params.toWardCode,
      weight: params.weightGrams,
      insurance_value: params.insuranceValue ?? 0,
      ...(params.fromDistrictId ? { from_district_id: params.fromDistrictId } : {}),
    }),
  });
  return data.total;
}

export type GhnOrderItem = { name: string; quantity: number; price: number };

export type GhnCreateOrderParams = {
  serviceTypeId: number;
  toName: string;
  toPhone: string;
  toAddress: string;
  toWardCode: string;
  toDistrictId: number;
  weightGrams: number;
  codAmount: number;
  note?: string;
  items: GhnOrderItem[];
};

export type GhnCreateOrderResult = {
  order_code: string;
  expected_delivery_time: string;
  total_fee: number;
};

export function ghnCreateOrder(auth: GhnAuth, params: GhnCreateOrderParams) {
  return ghnFetch<GhnCreateOrderResult>("/v2/shipping-order/create", auth, {
    method: "POST",
    body: JSON.stringify({
      service_type_id: params.serviceTypeId,
      // 2 = recipient's address pays nothing extra to GHN — the shop
      // settles the shipping fee with GHN directly; cod_amount below is
      // what the courier collects from the customer for the order itself.
      payment_type_id: 2,
      required_note: "KHONGCHOXEMHANG",
      to_name: params.toName,
      to_phone: params.toPhone,
      to_address: params.toAddress,
      to_ward_code: params.toWardCode,
      to_district_id: params.toDistrictId,
      weight: params.weightGrams,
      cod_amount: params.codAmount,
      note: params.note ?? "",
      items: params.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    }),
  });
}

export type GhnOrderDetail = { status: string; order_code: string };

export function ghnGetOrderDetail(auth: GhnAuth, orderCode: string) {
  return ghnFetch<GhnOrderDetail>("/v2/shipping-order/detail", auth, {
    method: "POST",
    body: JSON.stringify({ order_code: orderCode }),
  });
}

// Collapses GHN's fine-grained status vocabulary down to this app's 5-value
// order lifecycle (pending/confirmed/shipping/completed/cancelled).
export function mapGhnStatusToOrderStatus(ghnStatus: string): "confirmed" | "shipping" | "completed" | "cancelled" | null {
  switch (ghnStatus) {
    case "ready_to_pick":
      return "confirmed";
    case "picking":
    case "money_collect_picking":
    case "picked":
    case "storing":
    case "transporting":
    case "sorting":
    case "delivering":
    case "money_collect_delivering":
      return "shipping";
    case "delivered":
      return "completed";
    case "delivery_fail":
    case "waiting_to_return":
    case "return":
    case "return_transporting":
    case "return_sorting":
    case "returning":
    case "return_fail":
    case "returned":
    case "exception":
    case "damage":
    case "lost":
    case "cancel":
      return "cancelled";
    default:
      return null;
  }
}
