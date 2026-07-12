import http from 'http';

async function testBackend() {
  const postData = JSON.stringify({ ticker: "AAPL" });
  
  const req = http.request({
    hostname: 'localhost',
    port: 8000,
    path: '/api/v1/research',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': postData.length }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const response = JSON.parse(data);
      console.log("Started session:", response.sessionId);
      
      // Now stream it
      const streamReq = http.request({
        hostname: 'localhost',
        port: 8000,
        path: `/api/v1/research/${response.sessionId}/stream?ticker=AAPL`,
        method: 'GET'
      }, (streamRes) => {
        streamRes.on('data', chunk => {
          console.log("STREAM:", chunk.toString());
        });
      });
      streamReq.end();
    });
  });
  
  req.write(postData);
  req.end();
}

testBackend();
