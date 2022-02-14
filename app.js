const express = require('express');
const http = require('http');
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');
const Sharp = require('sharp');
const uuidv1 = require('uuid/v1');
const mkdirp = require('mkdirp');

const app = express();

app.use('/', express.static(path.join(__dirname, './public')));

app.post('/avatar', handleUpload);

let port = process.env.PORT || 8088;
app.set('port', port);

let server = http.createServer(app);

server.listen(port, function () {
  console.log(`Server passport listening on port: ${port}`);
});

const UPLOAD_DIR = './public/uploads/';

function handleUpload(req, res, next) {
  const form = new multiparty.Form({
    maxFilesSize: 2 * 1024 * 1024
  });

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.error(err);
      if (err.code === 'ETOOBIG') {
        res.json({
          state: 'fail',
          message: '文件大小不能超过 2 M'
        })
      } else {
        res.json({
          state: 'fail',
          message: '服务器错误'
        });
      }
      return;
    }

    const avatar = files.avatar && files.avatar[0];
    const fileType = avatar.headers['content-type'];
    if (fileType.split('/')[0] !== 'image') {
      fs.unlink(avatar.path, function (err) {
        if (err) {
          console.error(err);
        }
      });
      return res.json({
        state: 'fail',
        message: '文件格式错误'
      });
    }
    console.log('成功接收图片 %s，开始 Resize', avatar.originalFilename);

    mkdirp.sync(UPLOAD_DIR);
    const newName = uuidv1() + '.jpeg';
    const newPath = path.join(UPLOAD_DIR, newName);
    Sharp(avatar.path).resize(600).toFile(newPath, function (err, info) {
      if (err) {
        console.error(err);
        res.json({
          state: 'fail',
          message: '服务器错误'
        });
      } else {
        console.log('成功 Resize 图片！图片信息为：' + JSON.stringify(info));
        res.json({
          state: 'success',
          message: '图片上传成功',
          data: {
            width: info.width,
            height: info.height,
            path: '/uploads/' + newName
          }
        });
      }
    });
  });
}
