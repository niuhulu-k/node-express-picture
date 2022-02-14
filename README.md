# 图片上传

包括前端的图片预览、剪裁、上传等及 Node.js 后端对图片的保存，实现整个图片上传逻辑。

## 知识点

### 服务端

服务端使用了 **Express 4**，该版本使用 `body-parser` 无法处理上传的文件。所以，这里使用了 [multiparty](https://github.com/pillarjs/multiparty) 处理图片上传的问题。

图片上传后，需要对图片进行一定的处理，如：压缩、剪裁等，使用的是 [Sharp](https://github.com/lovell/sharp)。

### 前端

图片上传前的预览利用了 HTML5 **FileReader**，读取用户选择要上传的图片，不过该 API 存在兼容性的问题。

图片上传进度利用了 XMLHttpRequest 中的 **onprogress** 事件，通过 Event 参数中的 loaded 和 total 计算上传百分比。

## 如何测试

1.克隆仓库并安装依赖

```
$ cd node-image-upload
$ npm install

npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"
npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
npm install sharp
```

2.启动服务

```
$ npm start
```

服务默认监听 **8080** 端口，打开浏览器访问 http://localhost:8080 即可进行测试。

npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"
npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
npm install sharp