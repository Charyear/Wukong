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
async function translateText(text, targetLanguage) {
    const url = 'https://libretranslate.com/translate';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            q: text,
            source: 'auto', // 自动检测源语言
            target: targetLanguage,
            format: 'text'
        }),
    });

    if (!response.ok) {
        throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translatedText;
}
// JS/menu.js

const themeModal = document.getElementById("theme-modal");
const applyColorButton = document.getElementById("apply-color");
const bgColorInput = document.getElementById("bg-color");
const videoUpload = document.getElementById("video-upload");
const bgVideo = document.getElementById("bg-video");

applyColorButton.onclick = function() {
    const selectedColor = bgColorInput.value;
    document.body.style.backgroundColor = selectedColor; // Change the background color
    themeModal.style.display = "none"; // Hide the modal after applying
};

document.getElementById("apply-video").onclick = function() {
    const file = videoUpload.files[0];
    if (file) {
        const videoURL = URL.createObjectURL(file);
        bgVideo.src = videoURL; // Update the video source
        bgVideo.load(); // Load the new video
        bgVideo.play(); // Play the new video
    }
};

const modal = document.getElementById("team-modal");
const recruitmentLink = document.getElementById("recruitment-link");
const contactLink = document.getElementById("contact-link");
const closeButton = document.querySelector(".close-button");
const aboutLink = document.getElementById("about-link");
const closeButton2 = document.querySelector(".close-button_2");

recruitmentLink.onclick = function(event) {
    event.preventDefault(); // Prevent default link behavior
    modal.style.display = "block"; // Show the modal
};

contactLink.onclick = function(event) {
    event.preventDefault(); // Prevent default link behavior
    modal.style.display = "block"; // Show the modal
};

aboutLink.onclick = function(event) {
    event.preventDefault(); // Prevent default link behavior
    themeModal.style.display = "block"; // Show the theme modal
};

closeButton2.addEventListener("click", function() {
    const modalWithCloseButton2 = document.getElementById("team-modal");
    modalWithCloseButton2.style.display = "none"; // Hide the modal
});

closeButton.onclick = function() {
    themeModal.style.display = "none"; // Hide the modal
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"; // Hide the modal if clicked outside
    }
    if (event.target == themeModal) {
        themeModal.style.display = "none"; // Hide the modal if clicked outside
    }
};

function openAdminPage() {
    const password = prompt("请输入管理员账号:");
    const site_pv = document.getElementById('busuanzi_value_site_pv').innerText;
    console.log('即将打开的URL：', "admin.html?pv=" + encodeURIComponent(site_pv));
    if (password === "admin") {
        
        const adminUrl = "admin.html?pv=" + encodeURIComponent(site_pv);
        window.open(adminUrl, "_blank"); // 使用 adminUrl 而不是 "admin.html"
    } else {
        alert("密码错误，无法进入管理员界面。");
    }
}