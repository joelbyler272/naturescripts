/**
 * Centralized type guards for protocol data shapes
 * This ensures consistent type checking across the codebase
 */

import { Protocol } from '@/types';
import { GeneratedProtocol } from '@/lib/consultation/types';

/**
 * Type guard for the new GeneratedProtocol format (from consultation flow)
 */
export function isGeneratedProtocol(data: unknown): data is GeneratedProtocol {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;
  return (
    'summary' in obj &&
    typeof obj.summary === 'string' &&
    'recommendations' in obj &&
    Array.isArray(obj.recommendations)
  );
}

/**
 * Type guard for the old Protocol format (legacy data)
 */
export function isOldProtocol(data: unknown): data is Protocol {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;
  return (
    'analysis' in obj &&
    typeof obj.analysis === 'object' &&
    'phase1' in obj &&
    typeof obj.phase1 === 'object'
  );
}

/**
 * Extract a display label from any protocol data shape
 */
export function getProtocolLabel(
  protocolData: unknown,
  fallback: string
): string {
  if (isGeneratedProtocol(protocolData)) {
    return protocolData.summary;
  }
  if (isOldProtocol(protocolData)) {
    return protocolData.analysis?.patterns?.[0] ?? fallback;
  }
  return fallback;
}

/**
 * Extract recommendation count from any protocol data shape
 */
export function getRecommendationCount(protocolData: unknown): number {
  if (isGeneratedProtocol(protocolData)) {
    return protocolData.recommendations?.length ?? 0;
  }
  if (isOldProtocol(protocolData)) {
    return protocolData.phase1?.herbs?.length ?? 0;
  }
  return 0;
}
