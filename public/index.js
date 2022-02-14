(function (window, document) {
  const inputElem = document.getElementById('h5FileInput');
  inputElem.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      document.getElementById('preview').src = reader.result;
      document.getElementById('btn_save').removeAttribute('disabled');
    });
    reader.readAsDataURL(this.files[0]);
  });

  document.getElementById('btn_save').onclick = function (e) {
    uploadFile(inputElem.files[0]);
  };

  function uploadFile(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const xhr = new XMLHttpRequest();
    xhr.open("post", '/avatar', true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (xhr.status === 200) {
        const res = xhr.response;
        if (res.state === 'success') {
          const url = res.data.path;
          document.getElementById('preview').src = url;
          console.log('上传成功！图片地址为: ' + url);
        } else {
          alert('上传失败！' + res.message);
        }
      } else {
        alert(xhr.status + ': ' + xhr.statusText);
      }
    };
    xhr.upload.onloadstart = function () {//上传开始执行方法
      document.getElementById('process').style.display = 'block';
    };
    xhr.upload.onprogress = function (e) {
      let total = e.total;
      let loaded = e.loaded;
      document.getElementById('processBg').style.width = Math.floor(loaded / total * 100) + '%';
    };
    xhr.send(formData);
  }

  let count = 0;
  document.addEventListener('dragenter', function () {
    count++;
    document.getElementById('main').classList.add('drag-ready');
  });
  document.addEventListener('dragleave', function () {
    if (--count === 0) {
      document.getElementById('main').classList.remove('drag-ready');
    }
  });
  document.addEventListener('dragover', function (e) {
    e.preventDefault(); // 需要在 dragover 中阻止浏览器默认行为，否则 drop 事件不会触发
  });
  document.addEventListener('drop', function (e) {
    e.preventDefault();
    count = 0;
    document.getElementById('main').classList.remove('drag-ready');
    uploadFile(e.dataTransfer.files[0]);
  });
})(window, document);
