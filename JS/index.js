function navigateToChapter(chapterNumber) {
    const chapterUrls = {
        1: 'menu.html?chapter=1',
        2: 'menu.html?chapter=2',
        3: 'menu.html?chapter=3',
        4: 'menu.html?chapter=4',
        5: 'menu.html?chapter=5',
        6: 'menu.html?chapter=6'
    };

    // 创建视频元素
    const video = document.createElement('video');
    video.src = `video/cg${chapterNumber}.mp4`;
    video.style.position = 'fixed';
    video.style.top = 0;
    video.style.left = 0;
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.zIndex = 9999;
    video.controls = true; // 添加控制条
    document.body.appendChild(video);

    // 全屏播放视频
    video.play();
    video.requestFullscreen();

    // 跳过按钮
    const skipButton = document.createElement('button');
    skipButton.innerText = '跳过';
    skipButton.style.position = 'absolute';
    skipButton.style.top = '20px';
    skipButton.style.right = '20px'; // 调整位置到右上角
    skipButton.style.zIndex = 10000;
    skipButton.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'; // 背景色
    skipButton.style.color = 'white'; // 字体颜色
    skipButton.style.border = 'none'; // 无边框
    skipButton.style.borderRadius = '5px'; // 圆角
    skipButton.style.padding = '10px 15px'; // 内边距
    skipButton.style.fontSize = '16px'; // 字体大小
    skipButton.style.cursor = 'pointer'; // 鼠标指针
    skipButton.style.transition = 'background-color 0.3s'; // 动画效果

    // 悬停效果
    skipButton.onmouseover = () => {
        skipButton.style.backgroundColor = 'rgba(255, 0, 0, 1)'; // 悬停时背景色
    };
    skipButton.onmouseout = () => {
        skipButton.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'; // 恢复背景色
    };

    document.body.appendChild(skipButton);

    // 点击跳过按钮或视频播放结束后进入指定页面
    skipButton.onclick = () => {
        document.body.removeChild(video);
        document.body.removeChild(skipButton);
        window.location.href = chapterUrls[chapterNumber] || 'file/index.html';
    };

    video.onended = () => {
        document.body.removeChild(video);
        document.body.removeChild(skipButton);
        window.location.href = chapterUrls[chapterNumber] || 'file/index.html';
    };
}