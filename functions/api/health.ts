export function onRequestGet() {
  return Response.json({
    status: 'ok',
    service: 'dunamis-store',
    timestamp: new Date().toISOString()
  });
}
