// Local, dependency-free showcase server with seeking support for video files.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const allowed = new Set(['index.html', 'styles.css', 'app.js', 'd.mp4', 'output_single_line.mp4', 'yolov8_single_line_tracking.ipynb', 'assets/annotated-web.mp4', 'assets/poster.jpg', 'assets/original-poster.jpg']);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.mp4':'video/mp4','.jpg':'image/jpeg','.ipynb':'application/x-ipynb+json'};
const server = http.createServer((req,res) => {
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405, {'Allow':'GET, HEAD'});return res.end();}
  let name;
  try {name = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';}
  catch {res.writeHead(400);return res.end('Bad request');}
  if (!allowed.has(name)) {res.writeHead(404);return res.end('Not found');}
  const file = path.join(root,name);
  fs.stat(file, (err,stat) => {
    if(err || !stat.isFile()){res.writeHead(404);return res.end('Not found');}
    const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff'};
    let start=0,end=stat.size-1,status=200;
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match || (!match[1] && !match[2])){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
      if(!match[1]) start=Math.max(0,stat.size-Number(match[2]));
      else {start=Number(match[1]);if(match[2]) end=Math.min(Number(match[2]),end);}
      if(start>end || start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length']=end-start+1;
    res.writeHead(status,headers);
    if(req.method==='HEAD') return res.end();
    const stream=fs.createReadStream(file,{start,end});
    stream.on('error',()=>res.destroy());
    res.on('close',()=>stream.destroy());
    stream.pipe(res);
  });
});
server.listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log(`LineSight running at http://localhost:${server.address().port}`));
