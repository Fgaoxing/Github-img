GithubImg = {
    geshi:{
        webp: true,
        bmp: true,
        jpg: true,
        png: true,
        tif: true,
        gif: true,
        jepg: true
    },
    init: function (id, ApiKey, ref, repo) {
        GithubImg.id = id;
        GithubImg.ref = ref;
        GithubImg.repo = repo;
        GithubImg.apiKey = ApiKey;

        document.getElementById(id).innerHTML += '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css"><style>.img-card.w{background-color:rgba(255,255,255,.25)}.img-card.b>.img-bottom>i{color:#e8e8e8}.img-box,.img-card{float:left}.img-card{width:200px;height:250px;box-shadow:0 8px 32px 0 rgba(31,38,135,.37);backdrop-filter:blur(4px);border-radius:10px;margin:5px}.img-top>div,.img-top>img{height:130px;width:100%;z-index:997;border-radius:10px}.img-top>div{z-index:999;box-shadow:inset 0 8px 32px 0 rgba(17,17,17,.36);margin-top:-130px}.img-bottom>h4,.img-bottom>i,.img-bottom>p{margin:5px 10px}.img-bottom>i,.img-bottom>p{color:#bebebe}.img-bottom,.img-top>img{text-align:center}.btn.btn-primary.my-4{display:inline-block;font-weight:600;text-align:center;vertical-align:middle;border:1px solid transparent;padding:.625rem 1.25rem;font-size:.875rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;color:#fff;background-color:red;border-color:red;box-shadow:0 4px 6px rgb(50 50 93/11%),0 1px 3px rgb(0 0 0/8%);margin:5px}</style><button class="btn btn-primary my-4" style="background-color: #00cbff;position:relative;border-color: #00cbff;margin: 5px;width: 95%;"><input id="img-upload-input" type="file" style="opacity:0;width:100%;height:100%;position:absolute;top:0;left:0" onchange="GithubImg.up()" accept="image/gif, image/jpg, image/png, image/jepg, image/tif, image/bmp, image/webp">上传图片</button>'
        fetch('https://api.github.com/repos/' + repo + '/contents/?ref=' + ref).then(function (data) {
            data.json().then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (GithubImg.geshi[data[i].name.split('.')[data[i].name.split('.').length - 1]])
                        document.getElementById('img-box').innerHTML += `
    <div class="img-card w">
        <div class="img-top">
            <img src="https://cdn.staticaly.com/gh/` + repo + '@' + ref + '/' + data[i].name + `" alt="">
            <div></div>
        </div>
        <div class="img-bottom">
            <h4 style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">` + data[i].name + `</h4>
            <i class="far fa-clock">` + new Date(Number(data[i].name.split('.')[0])).toLocaleDateString().replace(/\//g, "-") + " " + new Date(Number(data[i].name.split('.')[0])).toTimeString().substr(0, 8) + `</i>
            <button onclick="GithubImg.copy('https://cdn.staticaly.com/gh/` + repo + '@' + ref + '/' + data[i].name + `')" class="btn btn-primary my-4" style="
    background-color: #0a76fa;
    border-color: #0a76fa;
">复制
            </button>
            <button onclick="GithubImg.delete('` + data[i]._links.self + `','` + data[i].sha + `','` + data[i].name + `')" class="btn btn-primary my-4">删除</button>
        </div>
    </div>
`
                }
            })
        })
    },
    copy: function (url) {
        var oInput = document.createElement('input');
        oInput.value = url;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        alert('已复制好!');
    },
    delete: function (url, sha, name) {
        fetch(url.split('?')[0], {
            method: 'delete',
            headers: {
                'Authorization': 'token ' + GithubImg.apiKey
            },
            body: JSON.stringify({
                sha: sha,
                path: name,
                owner: GithubImg.repo.split('/')[0],
                repo: GithubImg.repo.split('/')[1],
                message: 'Delete ' + name
            })
        }).then(function (data) {
            if (data.ok) {
                alert('删除成功')
            } else {
                alert('删除失败')
            }
            document.getElementById(GithubImg.id).innerHTML =''
            GithubImg.init(GithubImg.id, GithubImg.apiKey, GithubImg.ref, GithubImg.repo);
        })
    },
    up: function () {
        var img = document.getElementById('img-upload-input')
        for (var i = 0; i < img.files.length; i++) {
            var imgFile = new FileReader();
            imgFile.readAsDataURL(img.files[i]);
            imgFile.onload = function () {
                url = 'https://api.github.com/repos/' + GithubImg.repo + '/contents/' + new Date().getTime() + '.' + this.result.split(';')[0].split('/')[1]
                fetch(url, {
                    method: 'put',
                    headers: {
                        'Authorization': 'token ' + GithubImg.apiKey
                    },
                    body: JSON.stringify({
                        content: this.result.replace('data:image/png;base64,', ''),
                        message: 'UP ' + new Date().getTime() + this.result.split(';')[0].split('/')[1]
                    })
                }).then(function (data) {
                    if (data.ok) {
                        alert('上传成功')
                    } else {
                        alert('上传失败')
                    }
                    document.getElementById(GithubImg.id).innerHTML =''
                    GithubImg.init(GithubImg.id, GithubImg.apiKey, GithubImg.ref, GithubImg.repo);
                })
            }
        }
    }
}