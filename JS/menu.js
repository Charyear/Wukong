// file/JS/menu.js

const musicIcon = document.querySelector('.music-icon');
const audio = document.getElementById('bgMusic');
let isPlaying = false;

function toggleMusic() {
    if (!isPlaying) {
        audio.play();
        musicIcon.classList.add('playing');
    } else {
        audio.pause();
        musicIcon.classList.remove('playing');
    }
    isPlaying = !isPlaying;
}

// 添加鼠标悬停效果
document.querySelectorAll('.menu-item').forEach(item => {
    const circle = item.querySelector('.circle');
    const text = item.querySelector('.hover-text');
    
    item.addEventListener('mouseover', () => {
        text.style.opacity = '1';
    });
    
    item.addEventListener('mouseout', () => {
        text.style.opacity = '0';
    });
});

// 获取URL中的参数
const urlParams = new URLSearchParams(window.location.search);
const chapter = urlParams.get('chapter'); // 获取章节参数

// 根据章节参数设置跳转链接
const chapterBaseUrl = 'chapter'; // 基础URL前缀
if (chapter) {
    document.getElementById('characters-link').href = `${chapterBaseUrl}${chapter}/characters.html`;
    document.getElementById('guides-link').href = `${chapterBaseUrl}${chapter}/guides.html`;
    document.getElementById('culture-link').href = `${chapterBaseUrl}${chapter}/culture.html`;
    document.getElementById('classics-link').href = `${chapterBaseUrl}${chapter}/classics.html`;
}