export const rateLimiter = (limit: number, windowMs: number) => {
  const requests = new Map<string, { count: number; timer: NodeJS.Timeout }>();

  return (key: string) => {
    const currentTime = Date.now();

    if (!requests.has(key)) {
      requests.set(key, {
        count: 1,
        timer: setTimeout(() => requests.delete(key), windowMs),
      });
      return true;
    }

    const requestInfo = requests.get(key)!;

    if (requestInfo.count >= limit) {
      return false;
    }

    requestInfo.count += 1;
    return true;
  };
};
