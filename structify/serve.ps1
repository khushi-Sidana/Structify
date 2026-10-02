$port = 5000
$root = "C:\Users\Navaansh\.gemini\antigravity\scratch\structify"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Output "Structify Web Server running at http://localhost:$port/"

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $response.KeepAlive = $false
            $response.Headers.Add("Connection", "close")
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            $path = $request.Url.LocalPath
            if ($path -eq "/" -or [string]::IsNullOrWhiteSpace($path)) {
                $path = "/index.html"
            }

            $cleanPath = $path.TrimStart('/').Replace('/', '\')
            $fullPath = [System.IO.Path]::Combine($root, $cleanPath)

            if ([System.IO.File]::Exists($fullPath)) {
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                
                if ($fullPath.EndsWith(".html")) {
                    $response.ContentType = "text/html; charset=utf-8"
                } elseif ($fullPath.EndsWith(".css")) {
                    $response.ContentType = "text/css; charset=utf-8"
                } elseif ($fullPath.EndsWith(".js")) {
                    $response.ContentType = "application/javascript; charset=utf-8"
                } elseif ($fullPath.EndsWith(".json")) {
                    $response.ContentType = "application/json; charset=utf-8"
                } else {
                    $response.ContentType = "application/octet-stream"
                }

                $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.ContentLength64 = $err.Length
                $response.OutputStream.Write($err, 0, $err.Length)
            }
            $response.Close()
        } catch {
            # Continue on client disconnect
        }
    }
} finally {
    $listener.Stop()
}
