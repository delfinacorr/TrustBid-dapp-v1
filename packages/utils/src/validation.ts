import { isAddress } from "ethers";

export function isValidAddress(address: string): boolean {
  return isAddress(address);
}

export function isValidBidAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
}

export function isValidAuctionDuration(seconds: number): boolean {
  const ONE_HOUR = 3600;
  const THIRTY_DAYS = 30 * 24 * ONE_HOUR;
  return seconds >= ONE_HOUR && seconds <= THIRTY_DAYS;
}

export function isAuctionActive(endTime: Date): boolean {
  return new Date() < endTime;
}
