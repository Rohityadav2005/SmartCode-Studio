"""
SmartCode Studio - Local Web Server & Ollama Proxy
Serves static IDE files and proxies streaming requests to local Ollama (qwen2.5-coder:3b).
"""

import http.server
import socketserver
import urllib.request
import json
import sys
import os

PORT = 8080
OLLAMA_URL = "http://localhost:11434"

class SmartCodeHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable caching for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            self.handle_ai_chat()
        elif self.path == '/api/models':
            self.handle_list_models()
        else:
            self.send_error(404, "Endpoint Not Found")

    def handle_list_models(self):
        """Fetch available models from Ollama"""
        try:
            req = urllib.request.Request(f"{OLLAMA_URL}/api/tags", headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=3) as res:
                data = res.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            fallback = json.dumps({"models": [{"name": "qwen2.5-coder:3b"}, {"name": "qwen3:4b"}, {"name": "qwen3.5:4b"}]})
            self.wfile.write(fallback.encode('utf-8'))

    def handle_ai_chat(self):
        """Stream responses from local Ollama qwen2.5-coder:3b to browser client"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            payload = json.loads(body)

            model = payload.get('model', 'qwen2.5-coder:3b')
            messages = payload.get('messages', [])

            # Forward request to Ollama
            ollama_payload = {
                "model": model,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": 0.3
                }
            }

            req = urllib.request.Request(
                f"{OLLAMA_URL}/api/chat",
                data=json.dumps(ollama_payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )

            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.end_headers()

            with urllib.request.urlopen(req, timeout=120) as resp:
                for line in resp:
                    if not line:
                        continue
                    try:
                        chunk = json.loads(line.decode('utf-8'))
                        token = chunk.get('message', {}).get('content', '')
                        done = chunk.get('done', False)

                        sse_data = f"data: {json.dumps({'token': token, 'done': done})}\n\n"
                        self.wfile.write(sse_data.encode('utf-8'))
                        self.wfile.flush()
                        if done:
                            break
                    except Exception:
                        continue
            self.close_connection = True
        except Exception as err:
            # Fallback if Ollama model is still pulling or offline
            try:
                error_msg = f"Connecting to Ollama model '{model}'... (If downloading, check terminal: 'ollama pull {model}'). Error: {str(err)}"
                sse_data = f"data: {json.dumps({'token': error_msg, 'done': True})}\n\n"
                self.send_response(200)
                self.send_header('Content-Type', 'text/event-stream')
                self.end_headers()
                self.wfile.write(sse_data.encode('utf-8'))
                self.wfile.flush()
            except Exception:
                pass

if __name__ == '__main__':
    # Ensure current directory is served
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), SmartCodeHTTPHandler) as httpd:
        print(f"SmartCode Studio server running at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            httpd.server_close()
