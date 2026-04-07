export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function withDatabaseFallback<T>(
  callback: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!isDatabaseConfigured()) {
    return fallback;
  }

  try {
    return await callback();
  } catch (error) {
    console.error(error);
    return fallback;
  }
}
