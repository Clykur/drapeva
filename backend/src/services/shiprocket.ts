/* eslint-disable @typescript-eslint/no-explicit-any */
import { CacheService } from "./redis.js";
import { logger } from "../utils/logger.js";

const shiprocketEmail = process.env.SHIPROCKET_EMAIL || "";
const shiprocketPassword = process.env.SHIPROCKET_PASSWORD || "";
const apiBase = process.env.SHIPROCKET_API_BASE || "https://apiv2.shiprocket.in/v1/external";

const isMocked = !shiprocketEmail || !shiprocketPassword || shiprocketEmail.includes("mock");

interface ShiprocketAuthResponse {
  token: string;
}

export class ShiprocketService {
  private static tokenCacheKey = "shiprocket_auth_token";

  static async getToken(): Promise<string> {
    if (isMocked) {
      return "mock_shiprocket_jwt_token_2026";
    }

    // Try to get from Redis cache
    const cachedToken = await CacheService.get<string>(this.tokenCacheKey);
    if (cachedToken) {
      return cachedToken;
    }

    try {
      logger.info(`[Shiprocket] Authenticating as ${shiprocketEmail}`);
      const response = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: shiprocketEmail, password: shiprocketPassword }),
      });

      if (!response.ok) {
        throw new Error(`Auth failed with status ${response.status}`);
      }

      const data = (await response.json()) as ShiprocketAuthResponse;
      const token = data.token;

      // Cache token for 11 days (Shiprocket tokens are valid for 12 days)
      await CacheService.set(this.tokenCacheKey, token, 11 * 24 * 60 * 60);

      return token;
    } catch (err: unknown) {
      logger.error("[Shiprocket] Auth failed", {
        message: err instanceof Error ? err.message : String(err),
      });
      return "mock_shiprocket_jwt_token_fallback";
    }
  }

  static async makeRequest(endpoint: string, method: string, body?: any): Promise<any> {
    const token = await this.getToken();
    const url = `${apiBase}${endpoint}`;

    if (isMocked) {
      logger.debug(`[Shiprocket Mock] ${method} ${url}`);
      return this.getMockResponse(endpoint, method, body);
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const text = await response.text();
        logger.error(`[Shiprocket] API Error: ${url}`, { status: response.status });
        return { error: true, status: response.status, message: text };
      }

      return await response.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`[Shiprocket] Network Error: ${url}`, { message });
      return { error: true, message };
    }
  }

  static async createOrder(orderData: any) {
    return this.makeRequest("/orders/create/adhoc", "POST", orderData);
  }

  static async generateAWB(shipmentId: number, courierId?: number) {
    return this.makeRequest("/courier/assign/awb", "POST", {
      shipment_id: shipmentId,
      courier_id: courierId,
    });
  }

  static async requestPickup(shipmentIds: number[]) {
    return this.makeRequest("/courier/generate/pickup", "POST", { shipment_id: shipmentIds });
  }

  static async generateLabel(shipmentIds: number[]) {
    return this.makeRequest("/courier/generate/label", "POST", { shipment_id: shipmentIds });
  }

  static async generateInvoice(orderIds: number[]) {
    return this.makeRequest("/orders/print/invoice", "POST", { ids: orderIds });
  }

  static async generateManifest(shipmentIds: number[]) {
    return this.makeRequest("/manifests/generate", "POST", { shipment_id: shipmentIds });
  }

  static async cancelShipment(shipmentId: number) {
    return this.makeRequest("/orders/cancel/shipment/awb", "POST", { shipment_id: shipmentId });
  }

  static async checkServiceability(
    pickupPostcode: string,
    deliveryPostcode: string,
    weight: number,
    cod: boolean = false,
  ) {
    const codParam = cod ? 1 : 0;
    return this.makeRequest(
      `/courier/serviceability?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode}&weight=${weight}&cod=${codParam}`,
      "GET",
    );
  }

  static async getTrackingInfo(awb: string) {
    return this.makeRequest(`/courier/track/awb/${awb}`, "GET");
  }

  private static getMockResponse(endpoint: string, _method: string, _body?: any): any {
    const timestamp = new Date().toISOString();

    if (endpoint.includes("/orders/create/adhoc")) {
      return {
        order_id: 1234567,
        shipment_id: 9876543,
        status: "NEW",
        status_code: 1,
        onboarding_completed_now: 0,
        awb_code: `AWB-${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        courier_name: "Delhivery Direct",
        routing_code: "DEL/MUM/WEST",
        estimated_delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
    if (endpoint.includes("/courier/assign/awb")) {
      return {
        status: 200,
        response: {
          data: {
            awb_code: `AWB-${Math.floor(10000000000 + Math.random() * 90000000000)}`,
            courier_name: "Delhivery Direct",
          },
        },
      };
    }
    if (endpoint.includes("/courier/generate/label")) {
      return {
        label_created: 1,
        label_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      };
    }
    if (endpoint.includes("/orders/print/invoice")) {
      return {
        is_document_created: true,
        invoice_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      };
    }
    if (endpoint.includes("/manifests/generate")) {
      return {
        manifest_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      };
    }
    if (endpoint.includes("/orders/cancel/shipment/awb")) {
      return {
        status: 200,
        message: "Shipment cancelled successfully",
      };
    }
    if (endpoint.includes("/courier/serviceability")) {
      return {
        status: 200,
        data: {
          available_courier_companies: [
            {
              courier_company_id: 10,
              name: "Delhivery Direct",
              rate: 299,
              etd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toDateString(),
            },
            {
              courier_company_id: 21,
              name: "BlueDart Premium",
              rate: 499,
              etd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
            },
          ],
        },
      };
    }
    if (endpoint.includes("/courier/track/awb/")) {
      const parts = endpoint.split("/");
      const awb = parts[parts.length - 1];
      return {
        tracking_data: {
          track_status: 1,
          shipment_track: [
            {
              id: 9876543,
              awb_code: awb,
              current_status: "Shipped",
              current_timestamp: timestamp,
              scans: [
                { activity: "Shipment Picked Up", location: "Mumbai Warehouse", timestamp },
                { activity: "In Transit", location: "Delhi Hub", timestamp },
              ],
            },
          ],
        },
      };
    }

    return { status: "ok" };
  }
}
