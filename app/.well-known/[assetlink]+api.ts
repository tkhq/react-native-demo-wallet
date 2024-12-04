export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.pathname === '/.well-known/assetlinks.json') {
    return Response.json([
      {
        relation: [
          'delegate_permission/common.handle_all_urls',
          'delegate_permission/common.get_login_creds',
        ],
        target: {
          namespace: 'android_app',
          package_name: 'app.ngrok-free.3aa0-97-120-113-244',
          sha256_cert_fingerprints: [
            'A1:2A:66:04:CD:A8:7A:D4:65:8C:B5:0C:B4:76:53:8E:9A:B9:5E:7A:E7:A0:07:4E:DF:B4:6B:A2:BA:DE:49:3A',
          ],
        },
      },
    ]);
  }
  return Response.json({ error: 'Not Found' }, { status: 404 });
}
