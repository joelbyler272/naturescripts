// Re-export service client for admin use
// This maintains backward compatibility with any code using getAdminClient

import { createServiceClient } from './service';

export function getAdminClient() {
  return createServiceClient();
}
