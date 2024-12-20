const toggleMenuBtn = document.getElementById('toggleMenuBtn'); 
const collapsibleMenu = document.getElementById('collapsibleMenu'); 

toggleMenuBtn.addEventListener('click', function() { 
    if (collapsibleMenu.classList.contains('active')) { 
        collapsibleMenu.classList.remove('active'); 
        collapsibleMenu.classList.add('inactive'); 
        setTimeout(() => { collapsibleMenu.style.display = 'none'; }, 500); // 确保淡出动画结束后隐藏内容 
    } 
    else { 
        collapsibleMenu.style.display = 'flex'; // 确保淡入动画开始前显示内容 
        collapsibleMenu.classList.remove('inactive'); 
        collapsibleMenu.classList.add('active'); 
    } 
});
